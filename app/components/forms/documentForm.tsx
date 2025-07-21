"use client";
import React, { useEffect, useState } from "react";
import TagInput from "../input fields/tagsInput";
import { toast } from "react-hot-toast";
import { Doc } from "@/app/types/doc";

type Props = {
  onSuccess: () => void;
  editingDoc: Doc | null;
  clearEditing: () => void;
};

export default function DocumentForm({
  onSuccess,
  editingDoc,
  clearEditing,
}: Props) {
  const [docForm, setDocForm] = useState({
    title: "",
    type: "",
    description: "",
    tags: [] as string[],
    file: undefined as File | undefined,
  });

  const [isLoading, setIsLoading] = useState(false);

  const addDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingDoc
      ? `/api/documents/${editingDoc._id}`
      : "/api/documents";

    const method = editingDoc ? "PUT" : "POST";

    const formData = new FormData();

    formData.append("title", docForm.title);
    formData.append("type", docForm.type);
    formData.append("description", docForm.description || "");

    docForm.tags?.forEach((tag: string, i: number) => {
      formData.append(`tags[${i}]`, tag);
    });

    if (docForm.file) {
      formData.append("file", docForm.file);
    }

    try {
      setIsLoading(true);
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      if (res.ok) {
        clear();
        setIsLoading(false);
      }
      toast.success(data.message);
      onSuccess();
      clearEditing();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add document");
    }
  };
  const clear = () => {
    setDocForm({
      title: "",
      type: "",
      description: "",
      tags: [],
      file: undefined,
    });
    const input = document.getElementById(
      "myFileInput",
    ) as HTMLInputElement | null;
    if (input) input.value = "";
  };

  useEffect(() => {
    if (editingDoc) {
      setDocForm(editingDoc);
    }
  }, [editingDoc]);

  return (
    <form onSubmit={addDoc} className="mb-8 grid gap-3">
      <h1>{editingDoc ? "Edit" : "Create"}</h1>
      <input
        placeholder="Title"
        value={docForm.title || ""}
        onChange={(e) => setDocForm((f) => ({ ...f, title: e.target.value }))}
        className="rounded border p-2"
        required
      />
      <select
        value={docForm.type || ""}
        onChange={(e) => setDocForm((f) => ({ ...f, type: e.target.value }))}
        className="rounded border p-2"
        required
      >
        <option value="">Select Type</option>
        <option>Act</option>
        <option>Regulation</option>
        <option>Policy</option>
        <option>Form</option>
        <option>Directive</option>
        <option>Guideline</option>
        <option>Rules</option>
      </select>
      {editingDoc ? null : (
        <input
          type="file"
          id="myFileInput"
          accept=".pdf"
          onChange={(e) =>
            setDocForm((f) => ({
              ...f,
              file: e.target.files ? e.target.files[0] : undefined,
            }))
          }
          className="p-2"
          required
        />
      )}

      <input
        placeholder="Description"
        value={docForm.description || ""}
        onChange={(e) =>
          setDocForm((f) => ({ ...f, description: e.target.value }))
        }
        className="rounded border p-2"
      />
      <TagInput
        tags={docForm.tags || []}
        setTags={(newTags: string[]) =>
          setDocForm((f) => ({ ...f, tags: newTags }))
        }
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
        <span className="w-[200px]">{isLoading ? <p>Loading</p> : null}</span>
        <button
          type="submit"
          className="rounded bg-blue-700 px-4 py-2 text-white"
        >
          {editingDoc ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
