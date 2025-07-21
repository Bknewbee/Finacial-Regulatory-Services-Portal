import mongoose from "mongoose";

const PersonnelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  organisation: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  cell: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Personnel ||
  mongoose.model("Personnel", PersonnelSchema);
