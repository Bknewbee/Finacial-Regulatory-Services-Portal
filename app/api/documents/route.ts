import { uploadToS3 } from "../../lib/aws/s3";
import connectDB from "../../lib/mongodb";
import { Document } from "../../models/Document";
import { IncomingForm, Fields, Files } from "formidable";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import { verifyAuth } from "@/app/lib/authVerification";
import { cookies } from "next/headers";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const docs = await Document.find().sort({ createdAt: -1 });
  return NextResponse.json(docs);
}

async function toNodeCompatibleRequest(
  req: NextRequest,
): Promise<IncomingMessage> {
  return req.arrayBuffer().then((buffer) => {
    const stream = Readable.from(Buffer.from(buffer)) as IncomingMessage;
    stream.headers = Object.fromEntries(req.headers.entries());
    stream.method = req.method;
    stream.url = req.url;
    stream.httpVersion = "1.1"; // Mock minimum requirements
    stream.httpVersionMajor = 1;
    stream.httpVersionMinor = 1;
    stream.aborted = false;
    return stream;
  });
}

async function parseFormData(
  req: NextRequest,
): Promise<{ fields: Fields; files: Files }> {
  const nodeReq = await toNodeCompatibleRequest(req);
  const form = new IncomingForm({ keepExtensions: true, multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(nodeReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  const user = verifyAuth(token);
  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );

  try {
    await connectDB();
    const { fields, files } = await parseFormData(req);

    const title = String(fields.title || "");
    const type = String(fields.type || "");
    const description = String(fields.description || "");
    const tags: string[] = Object.entries(fields)
      .filter(([key]) => key.startsWith("tags["))
      .map(([, value]) => String(value));

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    const filepath = file?.filepath;
    if (!filepath) throw new Error("No filepath provided");
    const fileBuffer = await fs.promises.readFile(filepath);
    const originalFilename = file?.originalFilename ?? "untitled";
    const mimetype = file?.mimetype;
    if (!mimetype) throw new Error("No mime type");
    const s3Url = await uploadToS3(fileBuffer, originalFilename, mimetype);

    const doc = await Document.create({
      title,
      description,
      type,
      tags,
      originalName: file?.originalFilename,
      savedPath: s3Url, // now an S3 URL
    });

    return new Response(
      JSON.stringify({ message: "Uploaded to S3", url: s3Url, doc }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("S3 Upload failed:", err);
    return new Response("Upload error", { status: 500 });
  }
}
