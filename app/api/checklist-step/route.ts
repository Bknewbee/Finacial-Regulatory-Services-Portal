import { NextRequest, NextResponse } from "next/server";
import { ChecklistStep } from "../../models/ChecklistStep";
import connectDB from "../../lib/mongodb"; // assumes you're using a connectDB helper

//GET checklist steps
export async function GET(req: NextRequest) {
  await connectDB();
  const rawLicenseType = req.nextUrl.searchParams.get("license_type") || "";
  const licenseType = rawLicenseType.replace(/^"|"$/g, "").trim();

  console.log(licenseType);

  const query = licenseType
    ? {
        $or: [
          { license_type: licenseType },
          { custom_license_type: licenseType },
        ],
      }
    : {};

  const steps = await ChecklistStep.find(query).sort({ order: 1 });

  return NextResponse.json(steps);
}

//POST checklist steps
export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const newStep = new ChecklistStep({
    license_type: data.license_type,
    order: data.order,
    step: data.step,
    reference_section: data.reference_section,
    notes: data.notes,
    linkedDocTitle: data.linkedDocTitle,
    custom_license_type: data.custom_license_type || "",
  });
  console.log(newStep);

  try {
    const result = await newStep.save();
    console.log(result);

    if (result) {
      //return NextResponse.json(newStep, { status: 201 });
      return new Response(
        JSON.stringify({
          success: true,
          message: "Checklist added successfully",
        }),
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Checklist step not added",
        }),
        { status: 404 },
      );
    }

    // const newStep = await ChecklistStep.create({
    //   license_type: data.license_type,
    //   order: data.order,
    //   step: data.step,
    //   reference_section: data.reference_section,
    //   notes: data.notes,
    //   linkedDocTitle: data.linkedDocTitle,
    //   custom_license_type: data.custom_license_type || "",
    // });
  } catch (err) {
    console.error("[POST /checklist-step] ERROR:", err);
    return NextResponse.json(
      { error: "Failed to save checklist step." },
      { status: 500 },
    );
  }
}
