const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    // Snapshot of question titles (so history stays readable even if question is deleted)
    questions: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        title: String,
        topic: String,
        difficulty: String,
      },
    ],
    // Map of questionId → answer text written by user
    answers: {
      type: Map,
      of: String,
      default: {},
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    // Time taken in seconds
    timeTaken: {
      type: Number,
      default: 0,
    },
    // Score = number of questions answered (non-empty answers)
    score: {
      type: Number,
      default: 0,
    },
    // Overall score percentage calculated by the frontend
    overallScore: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
