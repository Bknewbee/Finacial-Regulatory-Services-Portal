"use client";
import { useState, useRef, useEffect } from "react";
import { formatPlainTextToJSX } from "../utils/formatPlainTextToJSX";

export default function FAQChatbot() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    const userMsg = { role: "user" as const, content: query };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setQuery("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      console.log(data?.response);

      const botMsg = {
        role: "assistant" as const,
        content:
          data?.response ||
          "I'm sorry, I couldn't find an answer to your question.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "An error occurred while trying to fetch a response. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex max-h-[80vh] w-full flex-col rounded-lg bg-white shadow-lg">
      <div className="border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Ask a Regulatory Question</h2>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`w-fit max-w-[90%] rounded-lg p-2 text-left whitespace-pre-wrap ${
              msg.role === "user"
                ? "ml-auto bg-blue-100 text-right"
                : "bg-gray-100"
            }`}
          >
            {formatPlainTextToJSX(msg.content)}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t p-2">
        <input
          type="text"
          placeholder="Type your question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 rounded border p-2"
        />
        <button
          onClick={handleSearch}
          className="rounded bg-blue-600 px-4 py-2 text-white"
          disabled={loading}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
