"use client";
import { useState } from "react";
import PublicSearchResults from "./components/PublicSearchResults";
import FAQs from "./components/views/FAQs";

export default function LandingPage() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(input.trim());
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Regulatory Portal</h1>

      <form onSubmit={handleSearchSubmit} className="mb-8 flex gap-2">
        <input
          type="text"
          placeholder="Search documents, events, personnel..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded border p-2"
        />
        <button
          type="submit"
          className="rounded bg-blue-700 px-4 py-2 text-white"
        >
          Search
        </button>
      </form>

      <PublicSearchResults query={query} />
      <FAQs />
    </div>
  );
}
