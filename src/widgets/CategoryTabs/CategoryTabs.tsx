"use client";

import { useEffect, useState } from "react";
import { categoriesService } from "@/services/categories.service";
import Button from "@/shared/ui/Button/Button";
import Modal from "@/shared/ui/Modal/Modal";
import styles from "./CategoryTabs.module.scss";
import type { Category } from "@/entities/category/model/types";

type Props = {
  categories: Category[];
  active: string | null;
  onChange: (name: string) => void;
  onCategoryCreated?: (name: string) => void;
  onCategoryDeleted?: (name: string) => void;
};

export default function CategoryTabs({
  categories,
  active,
  onChange,
  onCategoryCreated,
  onCategoryDeleted,
}: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setCategoryName("");
  };

  const createCategory = async () => {
    const name = categoryName.trim();
    if (!name) return;

    await categoriesService.create(name);
    closeCreateModal();
    if (onCategoryCreated) onCategoryCreated(name);
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;
    await categoriesService.remove(categoryToDelete);
    setIsDeleteOpen(false);
    if (onCategoryDeleted) onCategoryDeleted(categoryToDelete);
    setCategoryToDelete(null);
  };

  useEffect(() => {
    if (!isDeleteOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        deleteCategory();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDeleteOpen, categoryToDelete]);

  return (
    <>
      <div className={styles.tabs}>
        <button className={styles.tab} onClick={() => setIsCreateOpen(true)}>
          + Категория
        </button>
        {categories.map((c) => (
          <button
            key={c.name}
            onClick={() => onChange(c.name)}
            className={`${styles.tab} ${active === c.name ? styles.active : ""}`}
          >
            <span>{c.name}</span>
            <span
              className={styles.close}
              onClick={(event) => {
                event.stopPropagation();
                setCategoryToDelete(c.name);
                setIsDeleteOpen(true);
              }}
            >
              ×
            </span>
          </button>
        ))}
      </div>

      <Modal
        isOpen={isCreateOpen}
        title="Новая категория"
        onClose={closeCreateModal}
        actions={
          <>
            <Button variant="secondary" onClick={closeCreateModal}>
              Отмена
            </Button>
            <Button onClick={createCategory}>Сохранить</Button>
          </>
        }
      >
        <input
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              createCategory();
            }
          }}
          className={`input ${styles.modalInput}`}
          placeholder="Название категории"
        />
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        title="Удалить категорию"
        onClose={() => {
          setIsDeleteOpen(false);
          setCategoryToDelete(null);
        }}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteOpen(false);
                setCategoryToDelete(null);
              }}
            >
              Отмена
            </Button>
            <Button variant="danger" onClick={deleteCategory}>
              Удалить
            </Button>
          </>
        }
      >
        <p>
          Удалить категорию <b>{categoryToDelete}</b>?
        </p>
      </Modal>
    </>
  );
}