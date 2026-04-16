import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export const authService = {
  getUser() {
    return supabase.auth.getUser();
  },

  onChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },

  signOut() {
    return supabase.auth.signOut();
  },
};