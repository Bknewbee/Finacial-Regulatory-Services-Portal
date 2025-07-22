import dbConnect from "../../lib/mongodb";
import Personnel from "../../models/Personnel";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/app/lib/authVerification";

export async function GET() {
  await dbConnect();

  const personnel = await Personnel.find().sort({ createdAt: -1 });
  return NextResponse.json(personnel);
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
  const newPersonel = new Personnel(body);
  try {
    const result = await newPersonel.save();
    if (result) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Personel added successfully",
        }),
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Personnel not added",
        }),
        { status: 404 },
      );
    }
  } catch (err) {
    console.error("Creating personnel error", err);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error during creation",
      }),
      { status: 500 },
    );
  }
}
