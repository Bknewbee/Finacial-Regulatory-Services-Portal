import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "Invalid email" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const token = jwt.sign(
    { _id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // Create response
  const response = NextResponse.json({
    message: "Login successful",
    user: { email: user.email, name: user.name },
  });

  // Set cookie on response object
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
