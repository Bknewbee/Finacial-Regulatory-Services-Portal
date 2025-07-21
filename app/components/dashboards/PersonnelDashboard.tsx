"use client";
import { useState, useEffect } from "react";
import PersonnelList from "../views/PersonnelList";
import PersonnelForm from "../forms/personnelForm";
import { Person } from "@/app/types/personnel";

export default function PersonnelDashboard() {
  const [people, setPeople] = useState<Person[]>([]);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const getList = async () => {
    const res = await fetch("/api/personnel");
    const data = await res.json();
    setPeople(data);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="space-y-6">
      <PersonnelForm
        onSuccess={getList}
        editingPerson={editingPerson}
        clearEditing={() => setEditingPerson(null)}
      />
      <PersonnelList
        people={people}
        refresh={getList}
        onEdit={(person) => setEditingPerson(person)}
      />
    </div>
  );
}
