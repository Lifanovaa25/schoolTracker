"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./styles/styles.scss";
import AuthPage from "@/pages/AuthPage/AuthPage";

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
  // 🔐 USER
  const [user, setUser] = useState<any>(null);

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
  const [balance, setBalance] = useState({ collected: 0 });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState("");

  // 🔐 AUTH
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 📊 LOAD DATA
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

    setBalance({ collected });
  }

  async function handlePay() {
    if (!selectedStudent || !amountInput)
      return alert("Заполните все поля");

    const amount = Number(amountInput);
    if (isNaN(amount)) return alert("Введите число");

    await supabase.from("payments").insert({
      student_id: selectedStudent,
      category: activeCategory,
      amount,
      date: new Date(),
    });

    setSelectedStudent(null);
    setAmountInput("");
    loadData();
  }

  async function handleDelete(payment: Payment) {
    if (!confirm(`Удалить ${payment.amount}₽?`)) return;

    await supabase
      .from("payments")
      .delete()
      .eq("student_id", payment.student_id)
      .eq("category", payment.category)
      .eq("amount", payment.amount)
      .limit(1);

    loadData();
  }

  async function addCategory() {
    const name = prompt("Название категории:");
    if (!name) return;

    if (categories.find((c) => c.name === name))
      return alert("Уже есть");

    const { data } = await supabase
      .from("categories")
      .insert([{ name }])
      .select();

    if (data && data.length > 0) {
      setCategories((prev) => [...prev, data[0]]);
    }
  }

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  // 💰 категории
  function getCategoryTotals() {
    const totals: Record<string, number> = {};

    payments.forEach((p) => {
      if (!totals[p.category]) totals[p.category] = 0;
      totals[p.category] += Number(p.amount);
    });

    return totals;
  }

  // 🔐 если не вошёл
  if (!user) {
    return <AuthPage />;
  }

  const categoryTotals = getCategoryTotals();

  return (
    <main className="container">
      <h1>Деньги класса</h1>

      <button onClick={toggleTheme} className="button-secondary">
        {theme === "light" ? "🌙 Тёмная" : "☀️ Светлая"}
      </button>

      <button
        className="button-secondary"
        onClick={() => supabase.auth.signOut()}
      >
        Выйти
      </button>

      {/* 💰 ОБЩИЙ */}
      <div className="card">
        <h2>Всего: {balance.collected}₽</h2>
      </div>

      {/* 💰 ПО КАТЕГОРИЯМ */}
      <div className="card">
        <h3>По категориям:</h3>

        {Object.entries(categoryTotals).map(([cat, sum]) => (
          <p key={cat}>
            {cat}: {sum}₽
          </p>
        ))}
      </div>

      <button onClick={addCategory} className="button">
        Добавить категорию
      </button>

      {/* 🧭 */}
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

      {/* 📊 */}
      <table className="table">
        <thead>
          <tr>
            <th>№</th>
            <th>Ученик</th>
            <th>Мама</th>
            <th>Телефон</th>
            <th>Сумма</th>
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

            const alreadyPaid = studentPayments.length > 0;

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
                      className="input"
                    />
                  ) : alreadyPaid ? (
                    studentPayments.map((p, i) => (
                      <div key={i}>{p.amount}₽</div>
                    ))
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  {alreadyPaid ? (
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
                    <button onClick={handlePay} className="button">
                      Сохранить
                    </button>
                  ) : (
                    <button
                      className="button"
                      onClick={() => {
                        setSelectedStudent(s.id);
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