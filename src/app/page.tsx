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
  name: string;
};

type Payment = {
  student_id: string;
  amount: number;
  category: string;
};

export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [balance, setBalance] = useState({ collected: 0, spent: 0 });
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState("");

  async function loadData() {
    const { data: studentsData } = await supabase.from("students").select("*");
    const { data: paymentsData } = await supabase.from("payments").select("*");
    const { data: categoriesData } = await supabase.from("categories").select("*");

    const collected = paymentsData?.reduce((s, p) => s + Number(p.amount), 0) || 0;

    if (studentsData) setStudents(studentsData);
    if (categoriesData) setCategories(categoriesData);
    if (paymentsData) setPayments(paymentsData);
    setBalance({ collected, spent: 0 });
  }

  async function handlePay() {
    if (!selectedStudent || !selectedCategory || !amountInput) return alert("Заполните все поля");

    const amount = Number(amountInput);
    if (isNaN(amount)) return alert("Введите корректное число");

    await supabase
      .from("payments")
      .insert({ student_id: selectedStudent, category: selectedCategory, amount, date: new Date() });

    setSelectedStudent(null);
    setSelectedCategory(null);
    setAmountInput("");
    loadData();
  }

  async function addCategory() {
    const name = prompt("Название новой категории:");
    if (!name) return;

    if (categories.find(c => c.name === name)) return alert("Такая категория уже существует");

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select();

    if (error) return alert("Ошибка при добавлении категории: " + error.message);
    if (data && data.length > 0) setCategories(prev => [...prev, data[0]]);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Деньги класса</h1>
      <h2>Баланс: {balance.collected - balance.spent}₽</h2>
      <p>Собрано: {balance.collected}₽</p>
      <p>Потрачено: {balance.spent}₽</p>

      <button onClick={addCategory}>Добавить категорию</button>

      <hr />

      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>№</th>
            <th>Ученик</th>
            <th>Мама</th>
            <th>Телефон</th>
            <th>Сумма</th>
            <th>Категория</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => {
            const studentPayments = payments.filter(p => p.student_id === s.id);

            return (
              <tr key={s.id}>
                <td>{index + 1}</td>
                <td>{s.student_name}</td>
                <td>{s.mother_name}</td>
                <td>{s.mother_phone}</td>
                <td>
                  {selectedStudent === s.id ? (
                    <input
                      type="number"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="Сумма"
                    />
                  ) : (
                    studentPayments.map((p, i) => <div key={i}>{p.amount}₽</div>)
                  )}
                </td>
                <td>
                  {selectedStudent === s.id ? (
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    studentPayments.map((p, i) => <div key={i}>{p.category}</div>)
                  )}
                </td>
                <td>
                  {selectedStudent === s.id ? (
                    <button onClick={handlePay}>Сохранить</button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedStudent(s.id);
                        setSelectedCategory(null);
                        setAmountInput("");
                      }}
                    >
                      Внести платеж
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}