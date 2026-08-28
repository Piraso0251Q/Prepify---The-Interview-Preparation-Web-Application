const InterviewSession = require("../models/InterviewSession");


/**
 * contains business logic for history feature 
 */

const saveSession = async (req, res) => {
  try {
    const { role, questions, answers, startTime, endTime, timeTaken, overallScore } = req.body;

    
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
      overallScore: overallScore || 0,
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


const getSessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

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


const getSessionById = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      userId: req.user._id, 
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
