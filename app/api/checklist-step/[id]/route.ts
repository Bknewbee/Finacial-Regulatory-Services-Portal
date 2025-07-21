import connectDB from "@/app/lib/mongodb";
import { NextRequest } from "next/server";
import { isValidObjectId } from "@/app/utils/validate";
import { ChecklistStep } from "@/app/models/ChecklistStep";
import { Checkliststep } from "@/app/types/checklistStep";

type UpdateEventInput = Omit<Checkliststep, "_id">;

export async function DELETE(request: NextRequest) {
  await connectDB();

  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!isValidObjectId(id)) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid checklist step ID.",
      }),
      { status: 400 },
    );
  }

  try {
    const deletedItem = await ChecklistStep.findByIdAndDelete(id);

    if (deletedItem) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Checklist step deleted successfully",
        }),
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Checklist step not found",
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

  const newCheckliststep = {
    license_type: body.license_type,
    order: body.order,
    step: body.step,
    reference_section: body.reference_section,
    notes: body.notes,
    linkedDocTitle: body.linkedDocTitle,
    custom_license_type: body.custom_license_type,
  };

  if (!isValidObjectId(id)) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid checklist step ID.",
      }),
      { status: 400 },
    );
  }

  try {
    const update: UpdateEventInput = newCheckliststep;

    // Check file when we implement file updating.

    const updated = await ChecklistStep.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updated) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Checklist step not found.",
        }),
        { status: 404 },
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Checklist step updated successfully.",
        data: updated,
      }),
    );
  } catch (err) {
    console.error("PUT error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error while updating checklist step.",
      }),
      { status: 500 },
    );
  }
}
