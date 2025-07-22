"use client";
//import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Person } from "@/app/types/personnel";
type Props = {
  people: Person[];
  refresh: () => void;
  onEdit: (person: Person) => void;
};

export default function PersonnelList({ people, refresh, onEdit }: Props) {
  //const [people, setPeople] = useState<Personnel[]>([]);
  const url = "/api/personnel";

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();

    const options = {
      method: "DELETE",
    };
    if (window.confirm("are you sure you want to delete this document?")) {
      try {
        const res = await fetch(`${url}/${id}`, options);
        const data = await res.json();

        if (data.success) {
          toast.success(data.message);
          refresh();
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error("Deletion failed");
        console.log("Error deleting document", err);
      }
    }
  };

  // const getList = async () => {
  //   setPeople([]);
  //   const res = await fetch(url);
  //   const data = await res.json();
  //   setPeople(data);
  // };

  // useEffect(() => {
  //   getList();
  // }, []);

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-lg font-semibold">Personnel Directory</h2>
      <div className="space-y-4">
        {people.map((person) => (
          <div key={person._id} className="relative rounded border p-4 shadow">
            <p>
              <strong>Name:</strong> {person.name} {person.surname}
            </p>
            <p>
              <strong>Title:</strong> {person.title}
            </p>
            <p>
              <strong>Organisation:</strong> {person.organisation}
            </p>
            <p>
              <strong>Cell: +267</strong> {person.cell}
            </p>
            <p>
              <strong>Phone:</strong> {person.phone}
            </p>
            <div className="absolute right-1 bottom-1 flex space-x-2">
              <button
                onClick={() => {
                  onEdit(person);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="me-2 mb-1 rounded-lg border border-gray-200 bg-white px-5 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 focus:outline-none"
              >
                Edit
              </button>
              <button
                onClick={(e: React.MouseEvent) => deleteItem(person._id, e)}
                className="me-2 mb-1 rounded-lg border border-red-200 bg-red-600 px-5 py-1.5 text-sm font-medium text-gray-900 hover:border-red-600 hover:bg-red-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
