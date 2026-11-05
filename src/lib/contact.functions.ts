import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdminReady } from "./admin-security";
import { contactSchema } from "./contact";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error("Messages are unavailable right now. Please call or email us.");
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    const { error } = await client.from("contact_submissions").insert({
      full_name: data.fullName, email: data.email, phone: data.phone,
      subject: data.subject, message: data.message,
    });
    if (error) throw new Error("Your message could not be saved. Please try again or contact us directly.");
    return { saved: true };
  });

export const getContactMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: allowed }, { data: account }] = await Promise.all([
      context.supabase.rpc("has_permission", { _user_id: context.userId, _permission: "customers.view" }),
      context.supabase.from("admin_accounts").select("status, must_change_password").eq("user_id", context.userId).maybeSingle(),
    ]);
    assertAdminReady(account, Boolean(allowed));
    const { data, error } = await context.supabase.from("contact_submissions").select("id, created_at, full_name, email, phone, subject, message").order("created_at", { ascending: false }).limit(100);
    if (error) throw new Error("Contact messages could not be loaded.");
    return data;
  });