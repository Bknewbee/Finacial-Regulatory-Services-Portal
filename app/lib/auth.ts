// app/lib/auth.ts
import jwt from "jsonwebtoken";

export function verifyAuth(token: string | undefined) {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}
