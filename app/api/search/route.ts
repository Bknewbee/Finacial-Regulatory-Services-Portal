// /app/api/search/route.ts
import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import { Document } from "../../models/Document";
import Event from "../../models/Event";
import Personnel from "../../models/Personnel";
import { ChecklistStep } from "@/app/models/ChecklistStep";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  const [docs, events, people, checklists] = await Promise.all([
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
    Event.aggregate([
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
    Personnel.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { surname: { $regex: query, $options: "i" } },
            { organisation: { $regex: query, $options: "i" } },
            { title: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $sort: { surname: 1 },
      },
      { $limit: 10 },
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
      { $limit: 30 },
    ]),
  ]);

  const results = [
    ...docs.map((d) => ({
      typeS: "document",
      title: d.title,
      type: d.type,
      description: d.description,
      tags: d.tags,
      link: d.savedPath,
      score: d.score,
    })),
    ...events.map((e) => ({
      typeS: "event",
      title: e.title,
      description: e.description,
      link: e.link,
      score: e.score,
    })),
    ...people.map((p) => ({
      typeS: "personel",
      name: `${p.name} ${p.surname}`,
      description: `${p.title} at ${p.organisation}`,
      score: p.score,
    })),
    ...checklists.map((c) => ({
      typeS: "checklist step",
      license_type: `${c.license_type === "other" ? c.custom_license_type : c.license_type}`,
      step: `${c.step}`,
      order: `${c.order}`,
      reference_section: `${c.reference_section}`,
      score: c.score,
    })),
  ];

  results.sort((a, b) => b.score - a.score); // optional; already sorted per source

  return NextResponse.json(results);
}
