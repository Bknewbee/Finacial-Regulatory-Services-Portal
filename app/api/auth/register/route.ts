import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const existing = await User.findOne({ email });
  if (existing)
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 },
    );

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  return NextResponse.json({
    message: "User created",
    user: { email: user.email },
  });
}
