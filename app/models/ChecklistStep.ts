import mongoose from "mongoose";

const ChecklistStepSchema = new mongoose.Schema(
  {
    license_type: { type: String, required: true },
    custom_license_type: { type: String },
    order: { type: Number, required: true },
    step: { type: String, required: true },
    reference_section: { type: String, required: true },
    notes: { type: String },
    linkedDocTitle: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ChecklistStep =
  mongoose.models.ChecklistStep ||
  mongoose.model("ChecklistStep", ChecklistStepSchema);
