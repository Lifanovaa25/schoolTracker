"use client";

import { ReactNode, useEffect } from "react";
import styles from "./Modal.module.scss";

type Props = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  width?: number;
};

export default function Modal({
  isOpen,
  title,
  onClose,
  children,
  actions,
  width = 420,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ width }}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? <h3 className={styles.title}>{title}</h3> : null}
        <div className={styles.content}>{children}</div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </div>
  );
}
