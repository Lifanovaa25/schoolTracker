"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./AuthPage.module.scss";


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();

    setError(null);

    if (!email || !password) {
      return setError("Заполните все поля");
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setError("Проверьте почту для подтверждения");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {isLogin ? "Вход" : "Регистрация"}
        </h1>

        <form onSubmit={handleAuth} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.button} disabled={loading}>
            {loading
              ? "Загрузка..."
              : isLogin
              ? "Войти"
              : "Зарегистрироваться"}
          </button>
        </form>

        <button
          className={styles.secondary}
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
        >
          {isLogin
            ? "Нет аккаунта? Регистрация"
            : "Уже есть аккаунт? Войти"}
        </button>
      </div>
    </main>
  );
}