// components/forms/PersonelForm.tsx
"use client";
import { FAQ } from "@/app/types/faq";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import TagInput from "../input fields/tagsInput";
type Props = {
  onSuccess: () => void;
  editingFAQ: FAQ | null;
  clearEditing: () => void;
};

export default function FAQForm({
  onSuccess,
  editingFAQ,
  clearEditing,
}: Props) {
  const [faqForm, setFAQForm] = useState({
    question: "",
    answer: "",
    tags: [] as string[],
    context: "",
  });

  const clear = () => {
    setFAQForm({
      question: "",
      answer: "",
      tags: [],
      context: "",
    });
  };
  const addPersonel = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingFAQ ? `/api/faqs/${editingFAQ._id}` : "/api/faqs";
    const method = editingFAQ ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(faqForm),
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      if (res.ok) {
        clear();
      }

      toast.success(data.message);
      onSuccess();
      clearEditing();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add personnel");
    }
  };

  useEffect(() => {
    if (editingFAQ) {
      setFAQForm(editingFAQ);
    }
  }, [editingFAQ]);

  return (
    <form onSubmit={addPersonel} className="mb-8 grid gap-3">
      <input
        type="text"
        placeholder="Question"
        value={faqForm.question}
        onChange={(e) =>
          setFAQForm((f) => ({ ...f, question: e.target.value }))
        }
        className="rounded border p-2"
        required
      />
      <input
        type="text"
        placeholder="Answer"
        value={faqForm.answer}
        onChange={(e) => setFAQForm((f) => ({ ...f, answer: e.target.value }))}
        className="rounded border p-2"
        required
      />
      <TagInput
        tags={faqForm.tags || []}
        setTags={(newTags: string[]) =>
          setFAQForm((f) => ({ ...f, tags: newTags }))
        }
      />
      <input
        type="text"
        placeholder="context"
        value={faqForm.context}
        onChange={(e) => setFAQForm((f) => ({ ...f, context: e.target.value }))}
        className="rounded border p-2"
        required
      />

      <div className="flex w-full justify-between px-5">
        <button
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            clearEditing();
            clear();
          }}
          className="rounded bg-blue-700 px-4 py-2 text-white"
        >
          Clear
        </button>
        <button
          type="submit"
          className="rounded bg-blue-700 px-4 py-2 text-white"
        >
          {editingFAQ ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
