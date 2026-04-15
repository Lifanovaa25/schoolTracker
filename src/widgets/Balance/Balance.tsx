"use client";

import styles from "./Balance.module.scss";

export default function Balance({ payments }: any) {
  const total = payments.reduce((s: number, p: any) => s + p.amount, 0);

  const byCategory: Record<string, number> = {};

  payments.forEach((p: any) => {
    if (!byCategory[p.category]) byCategory[p.category] = 0;
    byCategory[p.category] += p.amount;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>Всего: {total}₽</h2>
      </div>

      <div className={styles.card}>
        <h3>По категориям</h3>

        {Object.entries(byCategory).map(([k, v]) => (
          <p key={k}>
            {k}: {v}₽
          </p>
        ))}
      </div>
    </div>
  );
}