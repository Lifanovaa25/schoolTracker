import { supabase } from "@/lib/supabase";

export const studentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from("students")
      .select("*");

    if (error) throw error;
    return data;
  },

  async updatePhone(studentId: string, mother_phone: string) {
    const { error } = await supabase
      .from("students")
      .update({ mother_phone })
      .eq("id", studentId);

    if (error) throw error;
  },
};