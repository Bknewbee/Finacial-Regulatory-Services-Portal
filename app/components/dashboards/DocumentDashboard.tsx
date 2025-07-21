"use client";
import { useState, useEffect } from "react";
import DocumentList from "../views/DocumentList";
import DocumentForm from "../forms/documentForm";
import { Doc } from "@/app/types/doc";

export default function DocumentDashboard() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [editingDoc, setEditingDoc] = useState<Doc | null>(null);

  const getList = async () => {
    const res = await fetch("/api/documents");
    const data = await res.json();
    setDocs(data);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="space-y-6">
      <DocumentForm
        onSuccess={getList}
        editingDoc={editingDoc}
        clearEditing={() => setEditingDoc(null)}
      />
      <DocumentList
        docs={docs}
        refresh={getList}
        onEdit={(doc) => setEditingDoc(doc)}
      />
    </div>
  );
}
