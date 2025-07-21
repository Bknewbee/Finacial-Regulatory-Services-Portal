"use client";
import { useState, useEffect } from "react";
import EventList from "../views/EventList";
import EventForm from "../forms/eventForm";
import { Event } from "@/app/types/event";

export default function EventDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const getList = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="space-y-6">
      <EventForm
        onSuccess={getList}
        editingEvent={editingEvent}
        clearEditing={() => setEditingEvent(null)}
      />
      <EventList
        events={events}
        refresh={getList}
        onEdit={(event) => setEditingEvent(event)}
      />
    </div>
  );
}
