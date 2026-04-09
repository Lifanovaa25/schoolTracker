"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Student = {
  id: string;
  student_name: string;
  mother_name: string;
  mother_phone: string;
};

type Category = {
  id: string;
  name: string;
  type: "payment" | "expense";
};

type Payment = {
  amount: number;
  category_id: string;
};

type Expense = {
  amount: number;
  category_id: string;
};

export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [balance, setBalance] = useState({ collected: 0, spent: 0 });

  async function loadData() {
    const { data: studentsData } = await supabase.from("students").select("*");
    const { data: paymentsData } = await supabase.from("payments").select("*");
    const { data: expensesData } = await supabase.from("expenses").select("*");
    const { data: categoriesData } = await supabase.from("categories").select("*");

    const collected = paymentsData?.reduce((s, p) => s + Number(p.amount), 0) || 0;
    const spent = expensesData?.reduce((s, e) => s + Number(e.amount), 0) || 0;

    if (studentsData) setStudents(studentsData);
    if (categoriesData) setCategories(categoriesData);
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

    // Выбираем категорию для платежа
    const paymentCategory = categories.find((c) => c.type === "payment");
    let category_id = paymentCategory?.id;
    if (!category_id) {
      const name = prompt("Введите название категории платежа:");
      if (!name) return;
      const { data: newCat } = await supabase.from("categories").insert([{ name, type: "payment" }]).select().single();
      category_id = newCat.id;
      setCategories((prev) => [...prev, newCat]);
    }

    await supabase.from("payments").insert({ student_id, amount, category_id, date: new Date() });
    loadData();
  }

  async function addCategory() {
    const name = prompt("Название новой категории:");
    if (!name) return;
    const type = prompt("Тип: payment или expense") as "payment" | "expense";
    if (type !== "payment" && type !== "expense") return alert("Неверный тип");
    const { data: newCat } = await supabase.from("categories").insert([{ name, type }]).select().single();
    setCategories((prev) => [...prev, newCat]);
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

      <button onClick={addCategory}>Добавить категорию</button>

      <hr />

      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
          <th>№</th>
            <th>Ученик</th>
            <th>Мама</th>
            <th>Телефон</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
        {students.map((s, index) => (
      <tr key={s.id}>
           <td>{index + 1}</td> 
              <td>{s.student_name}</td>
              <td>{s.mother_name}</td>
              <td>{s.mother_phone}</td>
              <td>
                <button onClick={() => pay(s.id)}>Внести платеж</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}