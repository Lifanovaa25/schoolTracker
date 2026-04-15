"use client";

import { useState } from "react";
import styles from "./StudentsTable.module.scss";
import Button from "@/shared/ui/Button/Button";

type Student = {
    id: string;
    student_name: string;
    mother_name: string;
    mother_phone: string;
};

type Payment = {
    student_id: string;
    amount: number;
    category: string;
};

type Props = {
    students: Student[];
    payments: Payment[];
    activeCategory: string | null;
    reload: () => void;

    onDeletePayment: (payment: Payment) => void;
    onCreatePayment: (data: {
        student_id: string;
        amount: number;
        category: string;
    }) => void;
};

export default function StudentsTable({
    students,
    payments,
    activeCategory,
    reload,
    onDeletePayment,
    onCreatePayment,
}: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const [amount, setAmount] = useState("");

    const getStudentPayments = (studentId: string) => {
        return payments.filter(
            (p) =>
                p.student_id === studentId &&
                p.category === activeCategory
        );
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th className={styles.head}>№</th>
                    <th className={styles.head}>Ученик</th>
                    <th className={styles.head}>Мама</th>
                    <th className={styles.head}>Телефон</th>
                    <th className={styles.head}>Сумма</th>
                    <th className={styles.head}>Действие</th>
                </tr>
            </thead>

            <tbody>
                {students.map((s, i) => {
                    const studentPayments = getStudentPayments(s.id);
                    const paid = studentPayments.length > 0;

                    return (
                        <tr key={s.id} className={styles.row}>
                            <td className={styles.cell}>{i + 1}</td>

                            <td className={styles.cell}>{s.student_name}</td>

                            <td className={styles.cell}>{s.mother_name}</td>

                            <td className={styles.cell}>{s.mother_phone}</td>

                            {/* 💰 сумма */}
                            <td className={styles.cell}>
                                {selected === s.id ? (
                                    <input
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="input"
                                        placeholder="Сумма"
                                    />
                                ) : paid ? (
                                    studentPayments.map((p, i) => (
                                        <div key={i}>{p.amount}₽</div>
                                    ))
                                ) : (
                                    "-"
                                )}
                            </td>

                            {/* ⚡ действия */}
                            <td className={styles.cell}>
                                <div className={styles.actions}>
                                    {paid ? (
                                        <>
                                            <span className="success">✔ оплачено</span>

                                            <Button
                                                variant="danger"
                                                onClick={() => {
                                                    const payment = studentPayments[0];
                                                    if (payment) onDeletePayment(payment);
                                                }}
                                            >
                                                Удалить
                                            </Button>
                                        </>
                                    ) : selected === s.id ? (
                                        <Button
                                            onClick={() => {
                                                if (!activeCategory) return;

                                                onCreatePayment({
                                                    student_id: s.id,
                                                    amount: Number(amount),
                                                    category: activeCategory,
                                                });

                                                setSelected(null);
                                                setAmount("");
                                            }}
                                        >
                                            Сохранить
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                setSelected(s.id);
                                                setAmount("");
                                            }}
                                        >
                                            Внести
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}