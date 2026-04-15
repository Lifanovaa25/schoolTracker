import { supabase } from "@/lib/supabase";

export const paymentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from("payments")
      .select("*");

    if (error) throw error;
    return data;
  },

  async create(payload: {
    student_id: string;
    category: string;
    amount: number;
  }) {
    const { error } = await supabase.from("payments").insert({
      ...payload,
      date: new Date(),
    });

    if (error) throw error;
  },

  async remove(payment: {
    student_id: string;
    category: string;
    amount: number;
  }) {
    const { error } = await supabase
      .from("payments")
      .delete()
      .match({
        student_id: payment.student_id,
        category: payment.category,
        amount: payment.amount,
      })
      .limit(1);

    if (error) throw error;
  },
};