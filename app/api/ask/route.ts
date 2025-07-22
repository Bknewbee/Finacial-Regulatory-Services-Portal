import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { ChecklistStep } from "@/app/models/ChecklistStep";
import { Document } from "@/app/models/Document";
import FAQ from "@/app/models/FAQ";

export async function POST(req: Request) {
  await connectDB();
  const { query } = await req.json();
  if (!query || query.length < 3) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }
  //   const normalizedQuery = query
  //     .replace(/^tell me about\s+/i, "")
  //     .replace(/^what is\s+/i, "")
  //     .trim();

  const [faqs, checklists, documents] = await Promise.all([
    FAQ.aggregate([
      {
        $search: {
          index: "default", // or your custom index name
          compound: {
            should: [
              {
                text: {
                  query,
                  path: "question",
                  score: { boost: { value: 10 } },
                },
              },
              {
                text: {
                  query,
                  path: "answer",
                  score: { boost: { value: 6 } },
                },
              },
              {
                text: {
                  query,
                  path: "tags",
                  score: { boost: { value: 3 } },
                },
              },
              {
                text: {
                  query,
                  path: "context",
                  score: { boost: { value: 4 } },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      {
        $addFields: {
          score: { $meta: "searchScore" },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 3 },
    ]),
    ChecklistStep.aggregate([
      {
        $search: {
          index: "default", // or your custom index name
          compound: {
            should: [
              {
                text: {
                  query,
                  path: "license_type",
                  score: { boost: { value: 6 } },
                },
              },
              {
                text: {
                  query,
                  path: "custom_license_type",
                  score: { boost: { value: 5 } },
                },
              },
              {
                text: {
                  query,
                  path: "step",
                  score: { boost: { value: 8 } },
                },
              },
              {
                text: {
                  query,
                  path: "reference_section",
                  score: { boost: { value: 4 } },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      {
        $addFields: {
          score: { $meta: "searchScore" },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 10 },
    ]),
    Document.aggregate([
      {
        $search: {
          index: "default",
          compound: {
            should: [
              {
                phrase: {
                  query,
                  path: "title",
                  score: { boost: { value: 8 } },
                },
              },
              {
                phrase: {
                  query,
                  path: "description",
                  score: { boost: { value: 5 } },
                },
              },
              {
                text: {
                  query,
                  path: ["tags", "type", "originalName"],
                  score: { boost: { value: 2 } },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      {
        $addFields: {
          score: { $meta: "searchScore" },
        },
      },
      {
        $sort: { score: -1 },
      },
      {
        $limit: 10,
      },
    ]),
  ]);

  const totalResults = faqs.length + checklists.length + documents.length;
  if (totalResults === 0) {
    return NextResponse.json({
      response:
        "I'm sorry, I couldn't find any verified regulatory information about your question. Please try rephrasing or check the available forms and guidelines.",
    });
  }

  const chunks = [
    ...faqs.map(
      (f) =>
        `FAQ:\nQ: ${f.question}\nA: ${f.answer}\nTags: ${f.tags?.join(", ")}\nContext: ${f.context ?? ""}`,
    ),
    ...checklists.map(
      (c) =>
        `Checklist (${c.license_type === "other" ? c.custom_license_type : c.license_type}):\nStep ${c.order}: ${c.step}\nReference: ${c.reference_section}\n${c.notes ? "Notes: " + c.notes : ""}`,
    ),
    ...documents.map(
      (d) =>
        `Document: ${d.title}\nDescription: ${d.description || d.descreption || ""}`,
    ),
  ];

  const prompt = `
You are a regulatory assistant for Botswana's Non-Bank Financial Institutions Regulatory Authority (NBFIRA), Bank of Botswana (BoB), and Financial Intelligence Agency (FIA).

Only answer using the context provided below. If you don't find an answer, reply with:
"I'm sorry, I couldn't find any verified regulatory information about your question. Please try rephrasing or check the available forms and guidelines."


Context:
${chunks.join("\n\n")}

User question: ${query}
`;

  const ollamaRes = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3", prompt, stream: true }),
  });

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = ollamaRes.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Stream lines as they come
        const parts = buffer.split("\n");
        buffer = parts.pop()!; // save partial

        for (const line of parts) {
          if (line.trim() === "") continue;

          try {
            const parsed = JSON.parse(line);
            const text = parsed.response || parsed.content;
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // ignore parse errors
          }
        }
      }

      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
