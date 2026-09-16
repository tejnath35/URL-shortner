import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    maxlength: 80,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  shortUrl: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  lastClickedAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("Url", urlSchema);
