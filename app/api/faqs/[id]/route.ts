import connectDB from "@/app/lib/mongodb";
import { NextRequest } from "next/server";
import { isValidObjectId } from "@/app/utils/validate";
import FAQModel from "@/app/models/FAQ";
import { FAQ } from "@/app/types/faq";

type UpdateFAQInput = Omit<FAQ, "_id">;

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
    const deletedItem = await FAQModel.findByIdAndDelete(id);

    if (deletedItem) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "FAQ deleted successfully",
        }),
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "FAQ not found",
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
    const update: UpdateFAQInput = body;

    // Check file when we implement file updating.

    const updated = await FAQModel.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updated) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "FAQ not found.",
        }),
        { status: 404 },
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "FAQ updated successfully.",
        data: updated,
      }),
    );
  } catch (err) {
    console.error("PUT error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error while updating FAQ.",
      }),
      { status: 500 },
    );
  }
}
