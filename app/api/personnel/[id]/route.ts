import connectDB from "@/app/lib/mongodb";
import { NextRequest } from "next/server";
import { isValidObjectId } from "@/app/utils/validate";
import Personnel from "@/app/models/Personnel";
import { Person } from "@/app/types/personnel";

type UpdateEventInput = Omit<Person, "_id">;

export async function DELETE(request: NextRequest) {
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
    const deletedItem = await Personnel.findByIdAndDelete(id);

    if (deletedItem) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Personnel deleted successfully",
        }),
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Personnel not found",
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
  await connectDB();
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  const body = await request.json();

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
    const update: UpdateEventInput = body;

    // Check file when we implement file updating.

    const updated = await Personnel.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updated) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Personnel not found.",
        }),
        { status: 404 },
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Personnel updated successfully.",
        data: updated,
      }),
    );
  } catch (err) {
    console.error("PUT error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error while updating personnel.",
      }),
      { status: 500 },
    );
  }
}
