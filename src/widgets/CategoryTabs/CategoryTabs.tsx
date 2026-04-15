"use client";

import styles from "./CategoryTabs.module.scss";

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: any) {
  return (
    <div className={styles.tabs}>
      {categories.map((c: any) => (
        <button
          key={c.name}
          onClick={() => onChange(c.name)}
          className={`${styles.tab} ${
            active === c.name ? styles.active : ""
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}