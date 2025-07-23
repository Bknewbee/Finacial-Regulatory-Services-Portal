"use client";
import { useEffect, useState } from "react";

type Result = {
  typeS: "document" | "event" | "personel" | "checklist step";
  title?: string;
  name?: string;
  description?: string;
  link?: string;
  tags?: string[];
  type?: string;
  reference_section?: string;
  step?: string;
  license_type?: string;
};

export default function PublicSearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const getDownloadUrl = () => {
    const first = results.find((r) => r.typeS === "checklist step");
    if (!first) return "/api/checklist";

    console.log(first);

    const base = "/api/checklist";
    if (first.license_type?.toLowerCase() === "other") {
      return `${base}?custom_license_type=${encodeURIComponent(first.license_type)}`;
    } else {
      return `${base}?license_type=${encodeURIComponent(first.license_type || "")}`;
    }
  };

  const getResults = async (q: string) => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();

    setResults(data);
    setLoading(false);
  };

  const filteredResults =
    filter === "all" ? results : results.filter((r) => r.typeS === filter);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    getResults(query);
  }, [query]);

  if (!query) return null;

  return (
    <div>
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by type:</label>
        <select
          className="rounded border p-1"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="document">Document</option>
          <option value="event">Event</option>
          <option value="personel">Personnel</option>
          <option value="checklist step">Checklist Step</option>
        </select>
      </div>
      {loading ? (
        <p>Searching...</p>
      ) : filteredResults.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col">
            {filter === "checklist step" && results.length > 0 && (
              <a
                href={getDownloadUrl()}
                className="mb-4 inline-block w-[230px] self-end-safe rounded bg-green-600 px-3 py-1 text-center text-white shadow hover:bg-green-700"
                download
              >
                Download Checklist PDF
              </a>
            )}
          </div>

          {filteredResults.map((res, i) => (
            <div key={i} className="rounded border p-4 shadow">
              <p>
                <strong>{res.typeS}</strong>
              </p>
              {res.title && (
                <p>
                  <strong>Title:</strong> {res.title}
                </p>
              )}
              {res.type && (
                <p>
                  <strong>Type:</strong> {res.type}
                </p>
              )}
              {res.name && (
                <p>
                  <strong>Name:</strong> {res.name}
                </p>
              )}
              {res.description && <p>{res.description}</p>}
              {res.tags && (
                <p>
                  <strong>Tags:</strong> {res.tags.join(", ")}
                </p>
              )}
              {res.link && (
                <a
                  href={res.link}
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Open
                </a>
              )}
              {res.license_type && (
                <p>
                  <strong>Title:</strong> {res.license_type}
                </p>
              )}
              {res.reference_section && (
                <p>
                  <strong>Section Ref:</strong> {res.reference_section}
                </p>
              )}
              {res.step && (
                <p>
                  <strong>Description:</strong> {res.step}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
