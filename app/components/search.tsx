"use client";
import React, { useEffect, useState } from "react";
import { licenseChecklists } from "../sample data/sampleData"; // import your data

const flattenChecklist = (list: typeof licenseChecklists) =>
  list.flatMap((license) =>
    license.steps.map((step) => ({
      license_type: license.license_type,
      ...step,
    })),
  );

const ChecklistSearch: React.FC = () => {
  const [query, setQuery] = useState("");

  const flatData = flattenChecklist(licenseChecklists);

  // Simple case-insensitive search in license_type and step text
  const filtered =
    query.trim() === ""
      ? flatData
      : flatData.filter(
          (item) =>
            item.license_type.toLowerCase().includes(query.toLowerCase()) ||
            item.step.toLowerCase().includes(query.toLowerCase()),
        );

  //fetch events
  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Regulatory Checklist Search
      </h1>
      <input
        type="text"
        value={query}
        placeholder="Search (e.g. 'AML', 'capital', 'microlending')"
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6 w-full rounded-lg border p-3"
      />

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">
          No results found for <span className="font-semibold">{query}</span>
        </div>
      ) : (
        <ul>
          {filtered.map((item) => (
            <li
              key={`${item.license_type}-${item.order}`}
              className="mb-4 rounded-lg border bg-gray-50 p-4"
            >
              <div className="font-semibold">
                {item.license_type}: Step {item.order}
              </div>
              <div className="mb-1">{item.step}</div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Reference:</span>{" "}
                {item.reference_section}
                {item.notes && (
                  <>
                    <br />
                    <span className="font-medium">Notes:</span> {item.notes}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChecklistSearch;
