"use client";
//import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Event } from "@/app/types/event";
type Props = {
  events: Event[];
  refresh: () => void;
  onEdit: (event: Event) => void;
};

export default function EventList({ events, refresh, onEdit }: Props) {
  //const [events, setEvents] = useState<Event[]>([]);
  const url = "/api/events";

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
  //   setEvents([]);
  //   const res = await fetch(url);
  //   const data = await res.json();
  //   setEvents(data);
  // };

  // useEffect(() => {
  //   getList();
  // }, []);

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-lg font-semibold">Upcoming Events & News</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="relative rounded border p-4 pb-10 shadow"
          >
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-800 md:text-3xl">
              {event.title.split("–")[0]}
              <br />
              {event.title.split("–")[1]}
            </h2>
            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Category:</strong> {event.category}
            </p>
            <p className="py-3">{event.description}</p>

            <p>
              <strong>Posted By:</strong> {event.postedBy}
            </p>
            {event.link && (
              <p>
                <strong>Link:</strong>{" "}
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </p>
            )}
            <div className="absolute right-1 bottom-1 flex space-x-2">
              <button
                onClick={() => {
                  onEdit(event);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-2xl bg-red-600 px-3 py-1"
              >
                Edit
              </button>
              <button
                onClick={(e: React.MouseEvent) => deleteItem(event._id, e)}
                className="rounded-2xl bg-red-600 px-3 py-1"
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
