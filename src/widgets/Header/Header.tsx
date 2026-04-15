"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Header.module.scss";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as any;
    const initial =
      saved ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t);
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }

  return (
    <div className={styles.header}>
      <h1>Деньги класса</h1>

      <div className={styles.actions}>
        <button onClick={toggle}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <button onClick={() => supabase.auth.signOut()}>
          Выйти
        </button>
      </div>
    </div>
  );
}