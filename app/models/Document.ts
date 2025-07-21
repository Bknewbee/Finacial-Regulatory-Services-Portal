// lib/models/Document.ts
import { Schema, model, models } from "mongoose";

const DocumentSchema = new Schema({
  title: String,
  description: String,
  type: String,
  tags: [String],
  originalName: String,
  savedPath: String,
  uploadedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export const Document = models.Document || model("Document", DocumentSchema);
