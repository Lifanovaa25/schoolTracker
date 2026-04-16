import { supabase } from "@/lib/supabase";
import type { Category } from "@/entities/category/model/types";

export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (error) throw error;
    return (data ?? []) as Category[];
  },

  async create(name: string) {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select();

    if (error) throw error;
    return data?.[0] as Category | undefined;
  },

  async remove(name: string) {
    const { error } = await supabase.from("categories").delete().eq("name", name);
    if (error) throw error;
  },
};