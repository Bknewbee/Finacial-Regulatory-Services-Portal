import dbConnect from "../../lib/mongodb";
import Event from "../../models/Event";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const event = await Event.find().sort({ createdAt: -1 });

  return NextResponse.json(event);
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();

  const newEvent = new Event(body);

  try {
    const result = await newEvent.save();
    if (result) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Event added successfully",
        }),
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Event not added",
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
