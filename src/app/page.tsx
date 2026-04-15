"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import './styles/styles.scss';

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
  // 🌗 THEME
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      setTheme(saved as "light" | "dark");
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";

      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  }

  // 📊 DATA
  const [students, setStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [balance, setBalance] = useState({ collected: 0, spent: 0 });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState("");

  async function loadData() {
    const { data: studentsData } = await supabase.from("students").select("*");
    const { data: paymentsData } = await supabase.from("payments").select("*");
    const { data: categoriesData } = await supabase.from("categories").select("*");

    const collected =
      paymentsData?.reduce((s, p) => s + Number(p.amount), 0) || 0;

    if (studentsData) setStudents(studentsData);

    if (categoriesData) {
      setCategories(categoriesData);
      if (categoriesData.length > 0 && !activeCategory) {
        setActiveCategory(categoriesData[0].name);
      }
    }

    if (paymentsData) setPayments(paymentsData);

    setBalance({ collected, spent: 0 });
  }

  async function handlePay() {
    if (!selectedStudent || !selectedCategory || !amountInput)
      return alert("Заполните все поля");

    const amount = Number(amountInput);
    if (isNaN(amount)) return alert("Введите корректное число");

    await supabase.from("payments").insert({
      student_id: selectedStudent,
      category: selectedCategory,
      amount,
      date: new Date(),
    });

    setSelectedStudent(null);
    setSelectedCategory(null);
    setAmountInput("");
    loadData();
  }
  async function handleDelete(payment: Payment) {
    const confirmDelete = confirm(`Удалить платеж ${payment.amount}₽ по категории "${payment.category}"?`);
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("student_id", payment.student_id)
      .eq("category", payment.category)
      .eq("amount", payment.amount)
      .limit(1); // удаляем только одну запись

    if (error) {
      alert("Ошибка при удалении: " + error.message);
    } else {
      loadData(); // обновляем данные после удаления
    }
  }
  async function addCategory() {
    const name = prompt("Название новой категории:");
    if (!name) return;

    if (categories.find((c) => c.name === name))
      return alert("Такая категория уже существует");

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select();

    if (error) return alert("Ошибка: " + error.message);

    if (data && data.length > 0) {
      setCategories((prev) => [...prev, data[0]]);
      if (!activeCategory) setActiveCategory(data[0].name);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // 🔥 синхронизация категории с вкладкой
  useEffect(() => {
    if (selectedStudent) {
      setSelectedCategory(activeCategory);
    }
  }, [activeCategory]);

  return (
    <main className="container">
      <h1>Деньги класса</h1>

      {/* 🌗 КНОПКА ТЕМЫ */}
      <button onClick={toggleTheme} className="button-secondary">
        {theme === "light" ? "🌙 Тёмная тема" : "☀️ Светлая тема"}
      </button>

      {/* 💰 БАЛАНС */}
      <div className="card">
        <h2>Баланс: {balance.collected - balance.spent}₽</h2>
        <p className="muted">Собрано: {balance.collected}₽</p>
        <p className="muted">Потрачено: {balance.spent}₽</p>
      </div>

      <button onClick={addCategory} className="button">
        Добавить категорию
      </button>

      {/* 🧭 ВКЛАДКИ */}
      <div className="tabs">
        {categories.map((c) => (
          <button
            key={c.name}
            onClick={() => setActiveCategory(c.name)}
            className={`tab ${activeCategory === c.name ? "active" : ""}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* 📊 ТАБЛИЦА */}
      <table className="table">
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
            const studentPayments = payments.filter(
              (p) =>
                p.student_id === s.id &&
                p.category === activeCategory
            );

            const allStudentPayments = payments.filter(
              (p) => p.student_id === s.id
            );

            const alreadyPaidInActive = allStudentPayments.some(
              (p) => p.category === activeCategory
            );

            return (
              <tr key={s.id}>
                <td>{index + 1}</td>
                <td>{s.student_name}</td>
                <td>{s.mother_name}</td>
                <td>{s.mother_phone}</td>

                {/* СУММА */}
                <td>
                  {selectedStudent === s.id ? (
                    <input
                      type="number"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="Сумма"
                      className="input"
                    />
                  ) : studentPayments.length > 0 ? (
                    studentPayments.map((p, i) => (
                      <div key={i}>{p.amount}₽</div>
                    ))
                  ) : (
                    "-"
                  )}
                </td>

                {/* КАТЕГОРИЯ */}
                <td>
                  {selectedStudent === s.id ? (
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value)
                      }
                      className="select"
                    >
                      <option value="">Выберите категорию</option>

                      {categories
                        .filter((c) => {
                          const alreadyPaid = allStudentPayments.some(
                            (p) => p.category === c.name
                          );
                          return !alreadyPaid;
                        })
                        .map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  ) : studentPayments.length > 0 ? (
                    studentPayments.map((p, i) => (
                      <div key={i}>{p.category}</div>
                    ))
                  ) : (
                    "-"
                  )}
                </td>

                {/* ДЕЙСТВИЕ */}
                <td>
                  {alreadyPaidInActive ? (
                    <>
                      <span className="success">Оплачено</span>
                      <button
                        className="button button-delete"
                        onClick={() => handleDelete(studentPayments[0])}
                      >
                        Удалить
                      </button>
                    </>
                  ) : selectedStudent === s.id ? (
                    <button onClick={handlePay} className="button">Сохранить</button>
                  ) : (
                    <button
                      className="button"
                      onClick={() => {
                        setSelectedStudent(s.id);
                        setSelectedCategory(activeCategory);
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