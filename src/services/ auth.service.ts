import { supabase } from "@/lib/supabase";

export const authService = {
  getUser() {
    return supabase.auth.getUser();
  },

  onChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },

  signOut() {
    return supabase.auth.signOut();
  },
};