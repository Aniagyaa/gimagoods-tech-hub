import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { customerCredentialsSchema, customerRegistrationSchema, customerUsernameSchema, isCustomerAccount, authErrorMessage } from "./validation";

export const registerCustomer = createServerFn({ method: "POST" })
  .inputValidator(input => customerRegistrationSchema.parse(input))
  .handler(async ({ data }) => {
    if (!data.contact) throw new Error("Please enter a valid Ghana contact number.");
    const { customerAuthClient, customerThrottle } = await import("./customer-auth.server");
    await customerThrottle(data.email);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const checks = await Promise.all([
      supabaseAdmin.from("profiles").select("id").eq("username_normalized", data.username.toLowerCase()).maybeSingle(),
      supabaseAdmin.from("admin_accounts").select("user_id").eq("username_normalized", data.username.toLowerCase()).maybeSingle(),
      supabaseAdmin.from("profiles").select("id").eq("email", data.email).maybeSingle(),
      supabaseAdmin.from("admin_accounts").select("user_id").ilike("auth_email", data.email.replace(/[%_]/g, c => `\\${c}`)).maybeSingle(),
      supabaseAdmin.from("profiles").select("id").eq("contact", data.contact).maybeSingle(),
    ]);
    if (checks.some(check => check.error)) throw new Error("Unable to connect to authentication service.");
    if (checks[0]?.data || checks[1]?.data) return { error: "Username already exists." };
    if (checks[2]?.data || checks[3]?.data) return { error: "Email address already registered." };
    if (checks[4]?.data) return { error: "Contact number already registered." };
    const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error("Unable to connect to authentication service.");
    const client = customerAuthClient(url, key);
    const { data: auth, error } = await client.auth.signUp({ email: data.email, password: data.password, options: { data: { customer_registration: true, username: data.username, full_name: data.fullName, contact: data.contact } } });
    if (error) return { error: authErrorMessage(error.message) };
    if (!auth.session || !auth.user) return { error: "Your account could not be signed in. Please try Login or contact GIMATech." };
    const [{ data: profile }, { data: roles }] = await Promise.all([
      client.from("profiles").select("account_status").eq("id", auth.user.id).maybeSingle(),
      client.from("user_roles").select("role").eq("user_id", auth.user.id),
    ]);
    if (!isCustomerAccount(profile, roles)) { await client.auth.signOut(); return { error: "Customer account access is unavailable. Please contact GIMATech." }; }
    return { error: null, session: { access_token: auth.session.access_token, refresh_token: auth.session.refresh_token } };
  });

export const loginCustomer = createServerFn({ method: "POST" })
  .inputValidator(input => customerCredentialsSchema.parse(input))
  .handler(async ({ data }) => {
    const invalid = "Invalid email, username or password.";
    const { customerAuthClient, customerThrottle } = await import("./customer-auth.server");
    await customerThrottle(data.identifier);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Username resolution stays server-only; no private email is returned to visitors.
    let email = data.identifier;
    if (!email.includes("@")) {
      const { data: profile, error } = await supabaseAdmin.from("profiles").select("email").eq("username_normalized", data.identifier).maybeSingle();
      if (error) throw new Error("Unable to connect to authentication service.");
      if (!profile?.email) return { error: invalid };
      email = profile.email;
    }
    const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error("Unable to connect to authentication service.");
    const client = customerAuthClient(url, key);
    const { data: auth, error } = await client.auth.signInWithPassword({ email, password: data.password });
    if (error || !auth.session) return { error: invalid };
    const [{ data: profile }, { data: roles }] = await Promise.all([
      client.from("profiles").select("account_status").eq("id", auth.user.id).maybeSingle(),
      client.from("user_roles").select("role").eq("user_id", auth.user.id),
    ]);
    if (!isCustomerAccount(profile, roles)) { await client.auth.signOut(); return { error: invalid }; }
    const { error: updateError } = await supabaseAdmin.from("profiles").update({ last_login_at: new Date().toISOString() }).eq("id", auth.user.id);
    if (updateError) { await client.auth.signOut(); throw new Error("Unable to connect to authentication service."); }
    return { error: null, session: { access_token: auth.session.access_token, refresh_token: auth.session.refresh_token } };
  });

export const updateCustomerProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ fullName: z.string().trim().min(1).max(100), username: customerUsernameSchema }).parse(input))
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