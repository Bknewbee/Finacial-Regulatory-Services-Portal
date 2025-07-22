import { NextResponse } from "next/server";
import FAQ from "@/app/models/FAQ";
import dbConnect from "../../lib/mongodb";
import { verifyAuth } from "@/app/lib/authVerification";
import { cookies } from "next/headers";

export async function GET() {
  const faqs = await FAQ.find().sort({ createdAt: -1 });

  try {
    return NextResponse.json(faqs);
  } catch (err) {
    console.error("Failed to load FAQ data:", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get("token")?.value;
  const user = verifyAuth(token);
  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  await dbConnect();

  const body = await request.json();
  const newFAQ = new FAQ(body);
  try {
    const result = await newFAQ.save();
    if (result) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "FAQ added successfully",
        }),
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "FAQ not added",
        }),
        { status: 404 },
      );
    }
  } catch (err) {
    console.error("Creating FAQ error", err);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error during creation",
      }),
      { status: 500 },
    );
  }
}
