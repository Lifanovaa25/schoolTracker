"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "@/shared/styles/styles.scss";
import AuthPage from "@/pages/AuthPage/AuthPage";
import Header from "@/widgets/Header/Header";
import Balance from "@/widgets/Balance/Balance";
import CategoryTabs from "@/widgets/CategoryTabs/CategoryTabs";
import StudentsTable from "@/widgets/StudentsTable/StudentsTable";
import { categoriesService } from "@/services/categories.service";
import { paymentsService } from "@/services/payments.service";
import { studentsService } from "@/services/students.service";
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
  const [user, setUser] = useState<any>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // 🔐 auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadData() {
    const [s, p, c] = await Promise.all([
      studentsService.getAll(),
      paymentsService.getAll(),
      categoriesService.getAll(),
    ]);
  
    if (s) setStudents(s);
    if (p) setPayments(p);
    if (c) {
      setCategories(c);
      if (!activeCategory && c.length) {
        setActiveCategory(c[0].name);
      }
    }
  }
  useEffect(() => {
    if (user) loadData();
  }, [user]);

  if (!user) return <AuthPage />;

  return (
    <main>
      <Header />

      <Balance payments={payments} />

      <CategoryTabs
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

<StudentsTable
  students={students}
  payments={payments}
  activeCategory={activeCategory}
  reload={loadData}

  onDeletePayment={async (payment) => {
    await supabase
      .from("payments")
      .delete()
      .eq("student_id", payment.student_id)
      .eq("category", payment.category)
      .eq("amount", payment.amount)
      .limit(1);

    loadData();
  }}

  onCreatePayment={async (data) => {
    await supabase.from("payments").insert({
      ...data,
      date: new Date(),
    });

    loadData();
  }}
/>
    </main>
  );
}