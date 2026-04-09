"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Student = {
  id: string;
  student_name: string;
  mother_name: string;
  mother_phone: string;
};

type Payment = {
  amount: number;
};

type Expense = {
  amount: number;
};

export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [balance, setBalance] = useState({ collected: 0, spent: 0 });

  async function loadData() {
    // Указываем generic для supabase.from правильно
    const { data: studentsData } = await supabase
      .from("students")
      .select("*") as { data: Student[] | null };

    const { data: paymentsData } = await supabase
      .from("payments")
      .select("amount") as { data: Payment[] | null };

    const { data: expensesData } = await supabase
      .from("expenses")
      .select("amount") as { data: Expense[] | null };

    const collected = paymentsData?.reduce((s, p) => s + Number(p.amount), 0) || 0;
    const spent = expensesData?.reduce((s, e) => s + Number(e.amount), 0) || 0;

    if (studentsData) setStudents(studentsData);
    setBalance({ collected, spent });
  }

  async function pay(student_id: string) {
    const amountStr = prompt("Сколько сдали?");
    if (!amountStr) return;

    const amount = Number(amountStr);
    if (isNaN(amount)) {
      alert("Введите корректное число");
      return;
    }

    await supabase.from("payments").insert({
      student_id,
      amount,
      date: new Date(),
    });

    loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Деньги класса</h1>

      <h2>Баланс: {balance.collected - balance.spent}€</h2>
      <p>Собрано: {balance.collected}€</p>
      <p>Потрачено: {balance.spent}€</p>

      <hr />

      {students.map((s) => (
        <div key={s.id} style={{ marginBottom: 10 }}>
          <b>{s.student_name}</b>
          <button style={{ marginLeft: 10 }} onClick={() => pay(s.id)}>
            внести платеж
          </button>
        </div>
      ))}
    </main>
  );
}