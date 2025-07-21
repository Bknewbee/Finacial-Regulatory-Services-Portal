"use client";
import React, { useState } from "react";
import TagInput from "./input fields/tagsInput";
import ChecklistStepForm from "./forms/checklistStep";

type Doc = {
  id: number;
  title: string;
  type: string;
  file?: File;
  description?: string;
  tags?: string[];
};

type Event = {
  id: number;
  title: string;
  date: string;
  description: string;
  category: string;
  link?: string;
  postedBy: string;
};
type Personel = {
  name: string;
  surname: string;
  title: string;
  organisation: string;
  cell: string;
  phone: string;
};

export default function AdminPanel() {
  const [tab, setTab] = useState<"docs" | "checklists" | "events" | "personel">(
    "docs",
  );

  // DOCS SECTION

  //const [docs, setDocs] = useState<Doc[]>([]);
  //const [steps, setSteps] = useState<ChecklistStep[]>([]);

  // Simple Doc upload
  const [docForm, setDocForm] = useState<Doc>({
    id: 0,
    title: "",
    type: "",
    tags: [],
  });

  // Simple Event uplaod
  const [eventForm, setEventForm] = useState<Omit<Event, "id">>({
    title: "",
    date: "",
    description: "",
    link: "",
    category: "Events and News",
    postedBy: "Admin 1",
  });
  // Simple Personel upload
  const [personelForm, setPersonelForm] = useState<Partial<Personel>>({
    name: "",
    surname: "",
    cell: "",
  });

  //Add Personel
  const addPersonel = (e: React.FormEvent) => {
    e.preventDefault();
    const cellValid = /^(?:\s*\d\s*){8}$/.test(personelForm.cell ?? "");
    const phoneValid = /^(?:\s*\d\s*){7}$/.test(personelForm.phone ?? "");

    //setCellValid(/^(?:\s*\d\s*){8}$/.test(personelForm.cell));
    //setPhoneValid(/^(?:\s*\d\s*){7}$/.test(personelForm.phone));

    if (cellValid && phoneValid) {
      console.log("sending");
      sendPersonel();
    }

    //sendPersonel();
  };

  //send Personel
  const sendPersonel = async () => {
    const url = "/api/personel";
    const options = {
      method: "POST",
      body: JSON.stringify(personelForm),
    };
    const res = await fetch(url, options);
    const data = await res.json();
    console.log(data);
    setPersonelForm({
      name: "",
      surname: "",
      title: "",
      organisation: "",
      phone: "",
      cell: "",
    });
  };
  //Add Event
  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();

    setEventForm({
      title: "",
      date: "",
      description: "",
      link: "",
      category: "Events and News",
      postedBy: "Admin 1",
    });
    sendEvent();
  };
  //send event
  const sendEvent = async () => {
    const url = "/api/events";
    const options = {
      method: "POST",
      body: JSON.stringify(eventForm),
    };
    const res = await fetch(url, options);
    const data = await res.json();
    console.log(data);
  };

  const addDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", docForm.title);
    formData.append("type", docForm.type);
    formData.append("description", docForm.description || "");

    // Append each tag (array style expected on backend)
    docForm.tags?.forEach((tag, i) => {
      formData.append(`tags[${i}]`, tag);
    });

    if (docForm.file) {
      formData.append("file", docForm.file);
    }

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      if (res.ok) {
        console.log(data);

        setDocForm({
          title: "",
          type: "",
          description: "",
          tags: [],
          id: 0,
        });
        const input = document.getElementById(
          "myFileInput",
        ) as HTMLInputElement | null;
        if (input) input.value = "";
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
      <h1 className="my-2">Admin Portal</h1>
      <div className="mb-6 flex">
        <button
          className={`rounded-l px-4 py-2 ${tab === "docs" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("docs")}
        >
          Documents
        </button>
        <button
          className={`px-4 py-2 ${tab === "checklists" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("checklists")}
        >
          Checklist Steps
        </button>
        <button
          className={`px-4 py-2 ${tab === "personel" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("personel")}
        >
          Personel
        </button>
        <button
          className={`rounded-r px-4 py-2 ${tab === "events" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("events")}
        >
          Events
        </button>
      </div>

      {tab === "docs" && (
        <form onSubmit={addDoc} className="mb-8 grid gap-3">
          <input
            placeholder="Title"
            value={docForm.title || ""}
            onChange={(e) =>
              setDocForm((f) => ({ ...f, title: e.target.value }))
            }
            className="rounded border p-2"
            required
          />
          <select
            value={docForm.type || ""}
            onChange={(e) =>
              setDocForm((f) => ({ ...f, type: e.target.value }))
            }
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
          </select>
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
          <input
            placeholder="Description"
            value={docForm.description || ""}
            onChange={(e) =>
              setDocForm((f) => ({ ...f, description: e.target.value }))
            }
            className="rounded border p-2"
          />
          {/* Tags */}

          <TagInput
            tags={docForm.tags || []}
            setTags={(newTags) => setDocForm((f) => ({ ...f, tags: newTags }))}
          />

          {/* <input
            placeholder="Tags (comma separated)"
            value={docForm.tags?.join(", ") || ""}
            onChange={(e) =>
              setDocForm((f) => ({
                ...f,
                tags: e.target.value.split(","),
              }))
            }
            className="rounded border p-2"
          /> */}
          <button
            type="submit"
            className="rounded bg-blue-700 px-4 py-2 text-white"
          >
            Add Document
          </button>
        </form>
      )}

      {tab === "checklists" && <ChecklistStepForm />}

      {tab === "events" && (
        <form onSubmit={addEvent} className="mb-8 grid gap-3">
          <input
            type="text"
            placeholder="Event Title"
            value={eventForm.title}
            onChange={(e) =>
              setEventForm((f) => ({ ...f, title: e.target.value }))
            }
            className="rounded border p-2"
            required
          />
          <input
            type="date"
            value={eventForm.date}
            onChange={(e) =>
              setEventForm((f) => ({ ...f, date: e.target.value }))
            }
            className="rounded border p-2"
            required
          />
          <textarea
            placeholder="Event Description"
            value={eventForm.description}
            onChange={(e) =>
              setEventForm((f) => ({ ...f, description: e.target.value }))
            }
            className="rounded border p-2"
            required
          />
          <input
            type="url"
            placeholder="Optional: Link or Registration URL"
            value={eventForm.link}
            onChange={(e) =>
              setEventForm((f) => ({ ...f, link: e.target.value }))
            }
            className="rounded border p-2"
          />
          <button
            type="submit"
            className="rounded bg-blue-700 px-4 py-2 text-white"
          >
            Add Event
          </button>
        </form>
      )}
      {tab === "personel" && (
        <form onSubmit={addPersonel} className="mb-8 grid gap-3">
          <input
            type="text"
            placeholder="Name"
            value={personelForm.name ?? ""}
            onChange={(e) =>
              setPersonelForm((f) => ({ ...f, name: e.target.value }))
            }
            className="rounded border p-2"
            required
          />
          <input
            type="text"
            placeholder="Surname"
            value={personelForm.surname ?? ""}
            onChange={(e) =>
              setPersonelForm((f) => ({ ...f, surname: e.target.value }))
            }
            className="rounded border p-2"
            required
          />
          <input
            type="text"
            placeholder="Title"
            value={personelForm.title ?? ""}
            onChange={(e) =>
              setPersonelForm((f) => ({ ...f, title: e.target.value }))
            }
            className="rounded border p-2"
            required
          />
          <input
            type="text"
            placeholder="Organisation"
            value={personelForm.organisation ?? ""}
            onChange={(e) =>
              setPersonelForm((f) => ({ ...f, organisation: e.target.value }))
            }
            className="rounded border p-2"
            required
          />
          <input
            type="text"
            placeholder="Cell Phone"
            value={personelForm.cell ?? ""}
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
            placeholder="phone"
            value={personelForm.phone ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (/^[\d\s]*$/.test(v)) {
                setPersonelForm((f) => ({ ...f, phone: v }));
              }
            }}
            className="rounded border p-2"
            required
          />

          <button
            type="submit"
            className="rounded bg-blue-700 px-4 py-2 text-white"
          >
            Add Personel
          </button>
        </form>
      )}
    </div>
  );
}
