import { supabase } from "@/lib/supabase";

export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (error) throw error;
    return data;
  },

  async create(name: string) {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select();

    if (error) throw error;
    return data?.[0];
  },
};