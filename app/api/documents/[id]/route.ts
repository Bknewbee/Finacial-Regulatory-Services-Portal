import { NextRequest, NextResponse } from "next/server";
import { Document } from "../../../models/Document";
import connectDB from "@/app/lib/mongodb";
import { isValidObjectId } from "@/app/utils/validate";
import { parseFormData } from "@/app/utils/formDataParser";
import { Doc } from "@/app/types/doc";
import { verifyAuth } from "@/app/lib/auth";
import { cookies } from "next/headers";

type UpdateDocInput = Omit<Doc, "_id" | "file" | "savedPath">;

export async function DELETE(request: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  const user = verifyAuth(token);
  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  await connectDB();

  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!isValidObjectId(id)) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid document ID.",
      }),
      { status: 400 },
    );
  }

  try {
    const deletedItem = await Document.findByIdAndDelete(id);

    if (deletedItem) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Document deleted successfully",
        }),
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Document not found",
        }),
        { status: 404 },
      );
    }
  } catch (err) {
    console.error("Delete error", err);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error during deletion",
      }),
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const token = (await cookies()).get("token")?.value;
  const user = verifyAuth(token);
  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  await connectDB();
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!isValidObjectId(id)) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid document ID.",
      }),
      { status: 400 },
    );
  }

  try {
    //When implementing file update
    //const { fields, files } = await parseFormData(request);
    const { fields } = await parseFormData(request);

    const tags: string[] = Object.entries(fields)
      .filter(([key]) => key.startsWith("tags["))
      .map(([, value]) => String(value));

    const update: UpdateDocInput = {
      title: String(fields.title || ""),
      type: String(fields.type || ""),
      description: String(fields.description || ""),
      tags: tags,
    };

    // Check file when we implement file updating.

    const updated = await Document.findByIdAndUpdate(id, update, { new: true });

    if (!updated) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Document not found.",
        }),
        { status: 404 },
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Document updated successfully.",
        data: updated,
      }),
    );
  } catch (err) {
    console.error("PUT error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error while updating document.",
      }),
      { status: 500 },
    );
  }
}
