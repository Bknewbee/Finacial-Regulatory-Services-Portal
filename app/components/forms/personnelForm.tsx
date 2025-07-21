// components/forms/PersonelForm.tsx
"use client";
import { Person } from "@/app/types/personnel";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
type Props = {
  onSuccess: () => void;
  editingPerson: Person | null;
  clearEditing: () => void;
};

export default function PersonnelForm({
  onSuccess,
  editingPerson,
  clearEditing,
}: Props) {
  const [personelForm, setPersonelForm] = useState({
    name: "",
    surname: "",
    title: "",
    organisation: "",
    cell: "",
    phone: "",
  });

  const clear = () => {
    setPersonelForm({
      name: "",
      surname: "",
      title: "",
      organisation: "",
      phone: "",
      cell: "",
    });
  };
  const addPersonel = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingPerson
      ? `/api/personnel/${editingPerson._id}`
      : "/api/personnel";
    const method = editingPerson ? "PUT" : "POST";

    const cellValid = /^(?:\s*\d\s*){8}$/.test(personelForm.cell);
    const phoneValid = /^(?:\s*\d\s*){7}$/.test(personelForm.phone);

    if (!cellValid || !phoneValid) {
      console.warn("Invalid cell or phone format");
      return;
    }

    try {
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(personelForm),
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
    if (editingPerson) {
      setPersonelForm(editingPerson);
    }
  }, [editingPerson]);

  return (
    <form onSubmit={addPersonel} className="mb-8 grid gap-3">
      <input
        type="text"
        placeholder="Name"
        value={personelForm.name}
        onChange={(e) =>
          setPersonelForm((f) => ({ ...f, name: e.target.value }))
        }
        className="rounded border p-2"
        required
      />
      <input
        type="text"
        placeholder="Surname"
        value={personelForm.surname}
        onChange={(e) =>
          setPersonelForm((f) => ({ ...f, surname: e.target.value }))
        }
        className="rounded border p-2"
        required
      />
      <input
        type="text"
        placeholder="Title"
        value={personelForm.title}
        onChange={(e) =>
          setPersonelForm((f) => ({ ...f, title: e.target.value }))
        }
        className="rounded border p-2"
        required
      />
      <input
        type="text"
        placeholder="Organisation"
        value={personelForm.organisation}
        onChange={(e) =>
          setPersonelForm((f) => ({ ...f, organisation: e.target.value }))
        }
        className="rounded border p-2"
        required
      />
      <input
        type="text"
        placeholder="Cell Phone"
        value={personelForm.cell}
        onChange={(e) => {
          const v = e.target.value;
          if (/^[\d\s]*$/.test(v)) {
            setPersonelForm((f) => ({ ...f, cell: v }));
          }
        }}
        className="rounded border p-2"
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={personelForm.phone}
        onChange={(e) => {
          const v = e.target.value;
          if (/^[\d\s]*$/.test(v)) {
            setPersonelForm((f) => ({ ...f, phone: v }));
          }
        }}
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
          {editingPerson ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
