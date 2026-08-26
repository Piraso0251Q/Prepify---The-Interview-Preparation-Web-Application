const Question = require("../models/Question");

// ─────────────────────────────────────────────────────────
// @route   GET /api/questions
// @desc    Get all questions with optional filters
// @access  Private (logged in users)
// Query params: ?role=Frontend&difficulty=Easy&topic=React&search=virtual+dom
// ─────────────────────────────────────────────────────────
const getQuestions = async (req, res) => {
  try {
    const { role, difficulty, topic, search } = req.query;

    // Build the filter object dynamically
    const filter = {};

    if (role)       filter.role       = role;
    if (difficulty) filter.difficulty = difficulty;
    if (topic)      filter.topic      = topic;

    // Text search on title and topic (uses the text index we created)
    if (search) {
      filter.$text = { $search: search };
    }

    const questions = await Question.find(filter).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch questions." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   GET /api/questions/:id
// @desc    Get a single question by its ID
// @access  Private (logged in users)
// ─────────────────────────────────────────────────────────
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    res.status(200).json({ success: true, question });
  } catch (error) {
    console.error("Get question by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch question." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   POST /api/admin/questions
// @desc    Add a new question (Admin only)
// @access  Private + Admin
// ─────────────────────────────────────────────────────────
const createQuestion = async (req, res) => {
  try {
    const { title, description, role, topic, difficulty, modelAnswer, explanation, keywords } = req.body;

    // Basic validation
    if (!title || !modelAnswer) {
      return res.status(400).json({
        success: false,
        message: "Title and model answer are required.",
      });
    }

    const question = await Question.create({
      title,
      description,
      role,
      topic,
      difficulty,
      modelAnswer,
      explanation,
      keywords: keywords || [],
    });

    res.status(201).json({
      success: true,
      message: "Question added successfully!",
      question,
    });
  } catch (error) {
    console.error("Create question error:", error);
    res.status(500).json({ success: false, message: "Failed to create question." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   PUT /api/admin/questions/:id
// @desc    Update a question (Admin only)
// @access  Private + Admin
// ─────────────────────────────────────────────────────────
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,          // update with whatever fields are sent
      { new: true, runValidators: true }  // return updated doc + validate
    );

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully!",
      question,
    });
  } catch (error) {
    console.error("Update question error:", error);
    res.status(500).json({ success: false, message: "Failed to update question." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   DELETE /api/admin/questions/:id
// @desc    Delete a question (Admin only)
// @access  Private + Admin
// ─────────────────────────────────────────────────────────
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully.",
    });
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({ success: false, message: "Failed to delete question." });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
