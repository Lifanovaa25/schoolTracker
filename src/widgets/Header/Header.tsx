"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Button from "@/shared/ui/Button/Button";
import styles from "./Header.module.scss";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;

    const initial =
      saved ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggleTheme(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const next = theme === "light" ? "dark" : "light";

    const ripple = document.createElement("div");
    ripple.className = styles.ripple;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    document.body.appendChild(ripple);

    setTimeout(() => {
      setTheme(next);
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
    }, 300);

    setTimeout(() => {
      ripple.remove();
    }, 900);
  }

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>💰 Деньги класса</h1>

      <div className={styles.actions}>
        <button className={styles.themeBtn} onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <Button
          variant="secondary"
          onClick={() => supabase.auth.signOut()}
        >
          Выйти
        </Button>
      </div>
    </div>
  );
}