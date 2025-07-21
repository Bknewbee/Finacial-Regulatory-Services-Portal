import { Readable } from "stream";
import type { IncomingMessage } from "http";
import { IncomingForm, Fields, Files } from "formidable";
//import type { NextRequest } from "next/server";

/**
 * Makes a regular Next.js request work like a Node.js IncomingMessage stream so it can be parsed by formidable.
 */
export async function toNodeCompatibleRequest(
  req: Request,
): Promise<Readable & IncomingMessage> {
  const buffer = await req.arrayBuffer();
  const stream = Readable.from(Buffer.from(buffer)) as Readable &
    IncomingMessage;

  stream.headers = Object.fromEntries(req.headers.entries());
  stream.method = req.method;
  stream.httpVersion = "1.1";
  stream.httpVersionMajor = 1;
  stream.httpVersionMinor = 1;
  stream.aborted = false;

  return stream;
}

/**
 * Parses multipart form data from a NextRequest using formidable
 */
export async function parseFormData(
  req: Request,
): Promise<{ fields: Fields; files: Files }> {
  const nodeReq = await toNodeCompatibleRequest(req);
  const form = new IncomingForm({ keepExtensions: true, multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(nodeReq, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}
