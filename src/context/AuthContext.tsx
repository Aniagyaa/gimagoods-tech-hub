import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User as AuthUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";

export interface CustomerProfile { id: string; full_name: string; contact: string; username: string }
interface AuthContextValue { user: AuthUser | null; profile: CustomerProfile | null; role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN" | null; loading: boolean; recoverySession: boolean; refreshProfile: () => Promise<void>; signOut: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<AuthContextValue["role"]>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoverySession, setRecoverySession] = useState(false);

  const loadProfile = async (nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (!nextUser) { setProfile(null); setRole(null); return; }
    const [{ data }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, contact, username, account_status").eq("id", nextUser.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", nextUser.id),
    ]);
    setProfile(data?.account_status === "active" ? data : null);
    setRole(roles?.some((row) => row.role === "SUPER_ADMIN") ? "SUPER_ADMIN" : roles?.some((row) => row.role === "ADMIN") ? "ADMIN" : roles?.some((row) => row.role === "CUSTOMER") ? "CUSTOMER" : null);
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      loadProfile(data.user).finally(() => setLoading(false));
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED" && event !== "PASSWORD_RECOVERY") return;
      window.setTimeout(async () => {
        if (!mounted) return;
        const { data } = session ? await supabase.auth.getUser() : { data: { user: null } };
        if (!mounted) return;
        if (event === "PASSWORD_RECOVERY") setRecoverySession(Boolean(data.user));
        if (event === "SIGNED_OUT" || event === "SIGNED_IN") setRecoverySession(false);
        await loadProfile(data.user);
        void router.invalidate();
        if (event !== "SIGNED_OUT") void queryClient.invalidateQueries();
      }, 0);
    });
    return () => { mounted = false; subscription.subscription.unsubscribe(); };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user, profile, role, loading, recoverySession,
    refreshProfile: () => loadProfile(user),
    signOut: async () => { await queryClient.cancelQueries(); queryClient.clear(); const { error } = await supabase.auth.signOut(); if (error) throw error; setUser(null); setProfile(null); setRole(null); await navigate({ to: "/login", replace: true }); },
  }), [loading, profile, role, user, recoverySession]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}