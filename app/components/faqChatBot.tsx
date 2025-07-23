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

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const botMsg = { role: "assistant" as const, content: "" };

      setMessages((prev) => [...prev, botMsg]); // append bot msg (initially empty)

      const updateLastMessage = (partial: string) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: partial,
          };
          return newMessages;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        updateLastMessage(buffer); // progressively update
      }
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
        <textarea
          //type="text-area"
          placeholder="Type your question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 rounded border p-2"
        />
        <button
          onClick={handleSearch}
          className="flex h-[50px] items-center justify-center self-center rounded bg-blue-600 px-4 py-2 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="inline h-4.5 w-4.5 animate-spin text-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 
        50 100.591C22.3858 100.591 0 78.2051 0 
        50.5908C0 22.9766 22.3858 0.59082 50 
        0.59082C77.6142 0.59082 100 22.9766 
        100 50.5908ZM9.08144 50.5908C9.08144 
        73.1895 27.4013 91.5094 50 91.5094C72.5987 
        91.5094 90.9186 73.1895 90.9186 
        50.5908C90.9186 27.9921 72.5987 9.67226 
        50 9.67226C27.4013 9.67226 9.08144 
        27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 
        97.8624 35.9116 97.0079 33.5539C95.2932 
        28.8227 92.871 24.3692 89.8167 20.348C85.8452 
        15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
        4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 
        0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 
        1.69328 37.813 4.19778 38.4501 6.62326C39.0873 
        9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 
        9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 
        10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 
        17.9648 79.3347 21.5619 82.5849 25.841C84.9175 
        28.9121 86.7997 32.2913 88.1811 35.8758C89.083 
        38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            </>
          ) : (
            "Ask"
          )}
        </button>
      </div>
    </div>
  );
}
