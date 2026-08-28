const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend", "Full-Stack", "SDE-1", "QA"],
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    modelAnswer: {
      type: String,
      required: [true, "Model answer is required"],
    },
    explanation: {
      type: String,
      default: "",
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, 
  }
);

// This lets us do text search like: ?search=virtual+dom
questionSchema.index({ title: "text", topic: "text" });

module.exports = mongoose.model("Question", questionSchema);
