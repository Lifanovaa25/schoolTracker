import { supabase } from "@/lib/supabase";

export const studentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from("students")
      .select("*");

    if (error) throw error;
    return data;
  },
};