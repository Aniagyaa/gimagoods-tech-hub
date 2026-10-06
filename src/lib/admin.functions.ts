import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const moduleSchema = z.enum(["analytics", "products", "categories", "inventory", "orders", "customers", "reviews", "finance", "payments", "discounts", "website", "delivery", "whatsapp", "staff", "settings", "security", "audit-logs"]);

export const resolveAdminLogin = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ username: z.string().trim().min(3).max(80), password: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: account } = await supabaseAdmin.from("admin_accounts")
      .select("user_id, auth_email, username, status").eq("username_normalized", data.username.toLowerCase()).maybeSingle();
    if (!account || account.status !== "active") throw new Error("Invalid administrator credentials.");
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error("Administrator login is unavailable.");
    const authClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: auth, error } = await authClient.auth.signInWithPassword({ email: account.auth_email, password: data.password });
    if (error || !auth.session || auth.user.id !== account.user_id) throw new Error("Invalid administrator credentials.");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", account.user_id);
    if (!roles?.length) throw new Error("Invalid administrator credentials.");
    const role = roles.some(({ role }) => role === "SUPER_ADMIN") ? "SUPER_ADMIN" : "ADMIN";
    await supabaseAdmin.from("admin_accounts").update({ last_login_at: new Date().toISOString() }).eq("user_id", account.user_id);
    await supabaseAdmin.from("audit_logs").insert({ administrator_id: account.user_id, username: account.username, role, action: "session.login", resource: "admin_account", resource_id: account.user_id });
    return { accessToken: auth.session.access_token, refreshToken: auth.session.refresh_token };
  });

export const getAdminSession = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: account }, { data: roles }] = await Promise.all([
      context.supabase.from("admin_accounts").select("full_name, username, contact, status, must_change_password").eq("user_id", context.userId).maybeSingle(),
      context.supabase.from("user_roles").select("role").eq("user_id", context.userId),
    ]);
    if (!account || account.status !== "active" || !roles?.length) throw new Error("Administrator access denied.");
    const role = roles.some(({ role }) => role === "SUPER_ADMIN") ? "SUPER_ADMIN" : "ADMIN";
    const { data: catalogue } = await context.supabase.from("permissions").select("key");
    const permissionChecks = await Promise.all((catalogue ?? []).map(async ({ key }) => {
      const { data } = await context.supabase.rpc("has_permission", { _user_id: context.userId, _permission: key });
      return data ? key : null;
    }));
    return { ...account, role, permissions: permissionChecks.filter((key): key is string => Boolean(key)) };
  });

export const getAdminAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: allowed } = await context.supabase.rpc("has_permission", { _user_id: context.userId, _permission: "analytics.view" });
    if (!allowed) throw new Error("You do not have permission to view analytics.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: profiles, error: profileError }, { data: wishlist, error: wishlistError }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, created_at").order("created_at", { ascending: true }),
      supabaseAdmin.from("wishlist_items").select("user_id, product_id, created_at"),
    ]);
    if (profileError || wishlistError) throw new Error("Analytics are temporarily unavailable.");
    const now = new Date();
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setUTCDate(now.getUTCDate() - 30);
    const monthCounts = new Map<string, number>();
    for (const profile of profiles ?? []) {
      const date = new Date(profile.created_at);
      const key = date.toLocaleDateString("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
    }
    const wishlistCounts = new Map<string, number>();
    for (const item of wishlist ?? []) wishlistCounts.set(item.product_id, (wishlistCounts.get(item.product_id) ?? 0) + 1);
    return {
      customers: profiles?.length ?? 0,
      newCustomers: profiles?.filter(({ created_at }) => new Date(created_at) >= thirtyDaysAgo).length ?? 0,
      wishlistSaves: wishlist?.length ?? 0,
      wishlistAdoption: profiles?.length ? Math.round(((new Set((wishlist ?? []).map((item) => item.user_id))).size / profiles.length) * 100) : 0,
      registrations: Array.from(monthCounts, ([month, customers]) => ({ month, customers })).slice(-6),
      popularWishlist: Array.from(wishlistCounts, ([productId, saves]) => ({ productId, saves })).sort((a, b) => b.saves - a.saves).slice(0, 5),
      unavailable: ["Sales", "Orders", "Average order value", "Profit", "Inventory", "Payment status"],
    };
  });

export const recordAdminEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ action: z.string().min(2).max(100), resource: z.string().min(2).max(100), resourceId: z.string().max(200).optional(), metadata: z.record(z.string(), z.string()).optional() }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: account } = await context.supabase.from("admin_accounts").select("username, status").eq("user_id", context.userId).maybeSingle();
    const { data: roles } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (!account || account.status !== "active" || !roles?.length) throw new Error("Administrator access denied.");
    const role = roles.some(({ role }) => role === "SUPER_ADMIN") ? "SUPER_ADMIN" : "ADMIN";
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("audit_logs").insert({ administrator_id: context.userId, username: account.username, role, action: data.action, resource: data.resource, resource_id: data.resourceId, metadata: data.metadata ?? {} });
    if (error) throw new Error("The administrative action could not be recorded.");
    return { ok: true };
  });

export const completeAdminPasswordChange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: account } = await context.supabase.from("admin_accounts").select("username, status").eq("user_id", context.userId).maybeSingle();
    const { data: roles } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (!account || account.status !== "active" || !roles?.length) throw new Error("Administrator access denied.");
    const role = roles.some(({ role }) => role === "SUPER_ADMIN") ? "SUPER_ADMIN" : "ADMIN";
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: updateError } = await supabaseAdmin.from("admin_accounts").update({ must_change_password: false }).eq("user_id", context.userId);
    if (updateError) throw new Error("Administrator setup could not be completed.");
    const { error: auditError } = await supabaseAdmin.from("audit_logs").insert({ administrator_id: context.userId, username: account.username, role, action: "password.changed", resource: "admin_account", resource_id: context.userId });
    if (auditError) throw new Error("Administrator setup could not be recorded.");
    return { ok: true };
  });

export { moduleSchema };