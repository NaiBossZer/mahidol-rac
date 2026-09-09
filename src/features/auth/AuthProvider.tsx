import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type AppRole = "staff" | "admin" | "dean" | "deputy_dean" | "finance_head" | "section_head";

type StaffProfile = {
  user_id: string;
  personnel_id: string | null;
  full_name: string;
  position: string | null;
  department: string | null;
  role: AppRole;
  active: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: StaffProfile | null;
  loading: boolean;
  configured: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!supabase) {
      setProfile(null);
      return;
    }
    const { data: authData } = await supabase.auth.getSession();
    const currentUser = authData.session?.user;
    if (!currentUser) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("staff_profiles")
      .select("user_id, personnel_id, full_name, position, department, role, active")
      .eq("user_id", currentUser.id)
      .maybeSingle();
    if (error) {
      console.error("Failed to load staff profile", error);
      setProfile(null);
      return;
    }
    setProfile((data as StaffProfile | null) ?? null);
  };

  useEffect(() => {
    let mounted = true;
    if (!supabase) {
      setLoading(false);
      return;
    }

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      await refreshProfile();
      if (mounted) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (event === "SIGNED_OUT") setProfile(null);
      else void refreshProfile();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    profile,
    loading,
    configured: isSupabaseConfigured,
    isAuthenticated: Boolean(session?.user),
    isAdmin: Boolean(profile?.active && ["admin", "dean", "deputy_dean", "finance_head", "section_head"].includes(profile.role)),
    signOut: async () => {
      if (supabase) await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
    },
    refreshProfile,
  }), [session, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
