import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { customerCredentialsSchema, customerRegistrationSchema, matchesCustomerCredentials, authErrorMessage } from "./validation";

export const registerCustomer = createServerFn({ method: "POST" })
  .inputValidator((input) => customerRegistrationSchema.parse(input))
  .handler(async ({ data }) => {
    if (!data.contact) throw new Error("Please enter a valid Ghana contact number.");
    const { customerAuthClient, customerThrottle } = await import("./customer-auth.server");
    await customerThrottle(data.contact);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: username, error: usernameError }, { data: contact, error: contactError }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id").eq("username_normalized", data.username.toLowerCase()).maybeSingle(),
      supabaseAdmin.from("profiles").select("id").eq("contact", data.contact).maybeSingle(),
    ]);
    if (usernameError || contactError) throw new Error("Unable to connect to authentication service.");
    if (username) return { error: "Username already exists." };
    if (contact) return { error: "Contact number already registered." };
    const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error("Unable to connect to authentication service.");
    const client = customerAuthClient(url, key);
    const { data: auth, error } = await client.auth.signUp({ phone: data.contact, password: data.password, options: { data: { username: data.username, full_name: data.fullName, contact: data.contact } } });
    if (error) { console.warn("customer_signup_failed", { code: error.code, status: error.status }); return { error: authErrorMessage(error.message) }; }
    // Profile and CUSTOMER membership are created atomically by the signup trigger.
    return { error: null, session: auth.session ? { access_token: auth.session.access_token, refresh_token: auth.session.refresh_token } : null };
  });

export const loginCustomer = createServerFn({ method: "POST" })
  .inputValidator((input) => customerCredentialsSchema.parse(input))
  .handler(async ({ data }) => {
    const invalid = "Invalid username, contact or password.";
    if (!data.contact) return { error: invalid };
    const { customerAuthClient, customerThrottle } = await import("./customer-auth.server");
    await customerThrottle(data.contact);
    const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error("Unable to connect to authentication service.");
    const client = customerAuthClient(url, key);
    const { data: auth, error } = await client.auth.signInWithPassword({ phone: data.contact, password: data.password });
    if (error || !auth.session) { console.warn("customer_login_failed", { code: error?.code, status: error?.status }); return { error: error?.code === "phone_provider_disabled" ? authErrorMessage(error.message) : invalid }; }
    const [{ data: profile }, { data: roles }] = await Promise.all([
      client.from("profiles").select("username, contact, account_status").eq("id", auth.user.id).maybeSingle(),
      client.from("user_roles").select("role").eq("user_id", auth.user.id),
    ]);
    if (!profile || !matchesCustomerCredentials(profile, data.username, data.contact) || !roles?.some((row) => row.role === "CUSTOMER") || roles.some((row) => row.role === "ADMIN" || row.role === "SUPER_ADMIN")) {
      await client.auth.signOut(); return { error: invalid };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: updateError } = await supabaseAdmin.from("profiles").update({ last_login_at: new Date().toISOString() }).eq("id", auth.user.id);
    if (updateError) { await client.auth.signOut(); throw new Error("Unable to connect to authentication service."); }
    return { error: null, session: { access_token: auth.session.access_token, refresh_token: auth.session.refresh_token } };
  });

export const updateCustomerProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ fullName: z.string().trim().min(1).max(100), username: z.string().trim().min(3).max(80) }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: profile } = await context.supabase.from("profiles").select("account_status").eq("id", context.userId).maybeSingle();
    if (profile?.account_status !== "active") throw new Error("Customer access denied.");
    const { error } = await context.supabase.from("profiles").update({ full_name: data.fullName, username: data.username, username_normalized: data.username.toLowerCase() }).eq("id", context.userId);
    if (error) return { error: error.code === "23505" ? "Username already exists." : "Your profile could not be updated." };
    return { error: null };
  });

export const changeCustomerPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ currentPassword: z.string().min(1).max(200), password: z.string().min(8).max(200), confirm: z.string() }).refine((value) => value.password === value.confirm, "Passwords do not match.").parse(input))
  .handler(async ({ context, data }) => {
    const { data: profile } = await context.supabase.from("profiles").select("account_status").eq("id", context.userId).maybeSingle();
    if (profile?.account_status !== "active") throw new Error("Customer access denied.");
    const { error } = await context.supabase.auth.updateUser({ password: data.password, current_password: data.currentPassword });
    return { error: error ? "Check your current password and choose a stronger new password." : null };
  });