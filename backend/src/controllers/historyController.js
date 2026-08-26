const InterviewSession = require("../models/InterviewSession");

// ─────────────────────────────────────────────────────────
// @route   POST /api/history
// @desc    Save a completed interview session
// @access  Private
// ─────────────────────────────────────────────────────────
const saveSession = async (req, res) => {
  try {
    const { role, questions, answers, startTime, endTime, timeTaken } = req.body;

    // Count how many questions were actually answered (non-empty)
    const answersMap = answers || {};
    const answeredCount = Object.values(answersMap).filter(
      (a) => a && a.trim().length > 0
    ).length;

    const session = await InterviewSession.create({
      userId: req.user._id,
      role,
      questions: questions || [],
      answers: answersMap,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      timeTaken: timeTaken || 0,
      score: answeredCount,
      totalQuestions: (questions || []).length,
    });

    res.status(201).json({
      success: true,
      message: "Interview session saved!",
      session,
    });
  } catch (error) {
    console.error("Save session error:", error);
    res.status(500).json({ success: false, message: "Failed to save session." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   GET /api/history
// @desc    Get all sessions for the logged-in user
// @access  Private
// ─────────────────────────────────────────────────────────
const getSessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch history." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   GET /api/history/:id
// @desc    Get a single session by ID (for Results page)
// @access  Private
// ─────────────────────────────────────────────────────────
const getSessionById = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      userId: req.user._id, // ensure user can only see their own sessions
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("Get session by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch session." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   DELETE /api/history
// @desc    Clear all interview history for the logged-in user
// @access  Private
// ─────────────────────────────────────────────────────────
const clearHistory = async (req, res) => {
  try {
    await InterviewSession.deleteMany({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: "History cleared successfully.",
    });
  } catch (error) {
    console.error("Clear history error:", error);
    res.status(500).json({ success: false, message: "Failed to clear history." });
  }
};

module.exports = { saveSession, getSessions, getSessionById, clearHistory };
