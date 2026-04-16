"use client";

import { useState } from "react";
import styles from "./StudentsTable.module.scss";
import Button from "@/shared/ui/Button/Button";
import Modal from "@/shared/ui/Modal/Modal";
import type { Student } from "@/entities/student/model/types";
import type { Payment } from "@/entities/payment/model/types";

type Props = {
    students: Student[];
    payments: Payment[];
    activeCategory: string | null;
    onDeletePayment: (payment: Payment) => void;
    onCreatePayment: (data: {
        student_id: string;
        amount: number;
        category: string;
    }) => void;
    onUpdatePhone: (studentId: string, phone: string) => void | Promise<void>;
};

export default function StudentsTable({
    students,
    payments,
    activeCategory,
    onDeletePayment,
    onCreatePayment,
    onUpdatePhone,
}: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const [amount, setAmount] = useState("");
    const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
    const [phoneValue, setPhoneValue] = useState("");

    const [openList, setOpenList] = useState(false);
    const [copied, setCopied] = useState(false);

    const sortedStudents = [...students].sort((a, b) =>
        a.student_name.localeCompare(b.student_name, "ru")
    );

    const getStudentPayments = (studentId: string) => {
        return payments.filter(
            (p) =>
                p.student_id === studentId &&
                p.category === activeCategory
        );
    };

    const paidStudents = sortedStudents.filter((s) =>
        payments.some(
            (p) =>
                p.student_id === s.id &&
                p.category === activeCategory
        )
    );

    const listText = paidStudents
        .map((s, i) => `${i + 1}. ${s.student_name}`)
        .join("\n");

    const savePhone = async (studentId: string) => {
        const nextPhone = phoneValue.trim();
        if (!nextPhone) return;
        await onUpdatePhone(studentId, nextPhone);
        setEditingPhoneId(null);
        setPhoneValue("");
    };

    return (
        <>
            <div className={styles.topBar}>
                <div className={styles.stats}>
                    📊 Сдали:{" "}
                    <b>
                    {paidStudents.length}/{sortedStudents.length}
                    </b>
                </div>

                <Button onClick={() => setOpenList(true)}>
                    Список сдавших
                </Button>
            </div>

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
                    {sortedStudents.map((s, i) => {
                        const studentPayments = getStudentPayments(s.id);
                        const paid = studentPayments.length > 0;

                        return (
                            <tr key={s.id} className={styles.row}>
                                <td className={styles.cell}>{i + 1}</td>

                                <td className={styles.cell}>
                                    {s.student_name}
                                </td>

                                <td className={styles.cell}>
                                    {s.mother_name}
                                </td>

                                <td className={styles.cell}>
                                    {editingPhoneId === s.id ? (
                                        <div className={styles.phoneEdit}>
                                            <input
                                                value={phoneValue}
                                                onChange={(event) =>
                                                    setPhoneValue(
                                                        event.target.value
                                                    )
                                                }
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault();
                                                        savePhone(s.id);
                                                    }
                                                }}
                                                className={`input ${styles.phoneInput}`}
                                                placeholder="Телефон"
                                            />
                                            <Button
                                                onClick={() => savePhone(s.id)}
                                            >
                                                ✓
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className={styles.phoneView}>
                                            <a href={`tel:${s.mother_phone}`}>
                                                {s.mother_phone}
                                            </a>
                                            <button
                                                className={styles.editPhoneBtn}
                                                aria-label="Изменить телефон"
                                                title="Изменить телефон"
                                                onClick={() => {
                                                    setEditingPhoneId(s.id);
                                                    setPhoneValue(
                                                        s.mother_phone ?? ""
                                                    );
                                                }}
                                            >
                                                ✏
                                            </button>
                                        </div>
                                    )}
                                </td>

                                <td className={styles.cell}>
                                    {selected === s.id ? (
                                        <input
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(e.target.value)
                                            }
                                            className="input"
                                            placeholder="Сумма"
                                        />
                                    ) : paid ? (
                                        studentPayments.map((p, i) => (
                                            <div key={i}>
                                                {p.amount}₽
                                            </div>
                                        ))
                                    ) : (
                                        "-"
                                    )}
                                </td>

                                <td className={styles.cell}>
                                    <div className={styles.actions}>
                                        {paid ? (
                                            <>
                                                <span className="success">
                                                    ✔ оплачено
                                                </span>

                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        const payment =
                                                            studentPayments[0];
                                                        if (payment)
                                                            onDeletePayment(
                                                                payment
                                                            );
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
                                                        category:
                                                            activeCategory,
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

            <Modal
                isOpen={openList}
                title="📋 Список сдавших"
                onClose={() => setOpenList(false)}
                actions={
                    <>
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(listText);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 1500);
                            }}
                        >
                            {copied ? "Скопировано ✓" : "Копировать"}
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => setOpenList(false)}
                        >
                            Закрыть
                        </Button>
                    </>
                }
            >
                <p className={styles.subtitle}>
                    Категория: <b>{activeCategory}</b>
                </p>

                <pre className={styles.list}>{listText}</pre>
            </Modal>
        </>
    );
}