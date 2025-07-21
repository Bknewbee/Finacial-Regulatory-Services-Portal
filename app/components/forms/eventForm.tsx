"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Event } from "@/app/types/event";
type Props = {
  onSuccess: () => void;
  editingEvent: Event | null;
  clearEditing: () => void;
};

export default function EventForm({
  onSuccess,
  editingEvent,
  clearEditing,
}: Props) {
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    description: "",
    link: "",
    category: "Events and News",
    postedBy: "Admin 1",
  });

  const clear = () => {
    setEventForm({
      title: "",
      date: "",
      description: "",
      link: "",
      category: "Events and News",
      postedBy: "Admin 1",
    });
  };

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingEvent
      ? `/api/events/${editingEvent._id}`
      : "/api/events";
    const method = editingEvent ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(eventForm),
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
      console.error("Error submitting event:", err);
      toast.error("Failed to add event");
    }
  };

  useEffect(() => {
    if (editingEvent) {
      const newDate = editingEvent.date.split("T")[0];
      editingEvent.date = newDate;

      setEventForm(editingEvent);
    }
  }, [editingEvent]);

  return (
    <form onSubmit={addEvent} className="mb-8 grid gap-3">
      <input
        type="text"
        placeholder="Event Title"
        value={eventForm.title}
        onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))}
        className="rounded border p-2"
        required
      />
      <input
        type="date"
        value={eventForm.date}
        onChange={(e) => setEventForm((f) => ({ ...f, date: e.target.value }))}
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
        onChange={(e) => setEventForm((f) => ({ ...f, link: e.target.value }))}
        className="rounded border p-2"
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
          {editingEvent ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
