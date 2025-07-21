import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  date: {
    type: Date,
  },
  relatedDocument: {
    type: String,
  },
  postedBy: {
    type: String,
  },
  link: String,
  category: String,
  description: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
