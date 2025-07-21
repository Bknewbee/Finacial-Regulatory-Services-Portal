"use client";
import { useState, useEffect } from "react";
import FAQList from "../views/FAQList";
import FAQForm from "../forms/FAQForm";
import { FAQ } from "@/app/types/faq";

export default function FAQDashboard() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const getList = async () => {
    const res = await fetch("/api/faqs");
    const data = await res.json();
    setFaqs(data);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="space-y-6">
      <FAQForm
        onSuccess={getList}
        editingFAQ={editingFAQ}
        clearEditing={() => setEditingFAQ(null)}
      />
      <FAQList
        faqs={faqs}
        refresh={getList}
        onEdit={(faq) => setEditingFAQ(faq)}
      />
    </div>
  );
}
