import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User as AuthUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface CustomerProfile { id: string; full_name: string; contact: string; username: string }
interface AuthContextValue { user: AuthUser | null; profile: CustomerProfile | null; loading: boolean; refreshProfile: () => Promise<void>; signOut: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (!nextUser) { setProfile(null); return; }
    const { data } = await supabase.from("profiles").select("id, full_name, contact, username").eq("id", nextUser.id).maybeSingle();
    setProfile(data ?? null);
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      loadProfile(data.user).finally(() => setLoading(false));
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      window.setTimeout(() => loadProfile(session?.user ?? null), 0);
    });
    return () => { mounted = false; subscription.subscription.unsubscribe(); };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user, profile, loading,
    refreshProfile: () => loadProfile(user),
    signOut: async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); },
  }), [loading, profile, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}