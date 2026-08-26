const Bookmark = require("../models/Bookmark");

// ─────────────────────────────────────────────────────────
// @route   GET /api/bookmarks
// @desc    Get all bookmarked question IDs for logged-in user
// @access  Private
// ─────────────────────────────────────────────────────────
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id });

    // Return just the question IDs (as strings) — same format frontend expects
    const questionIds = bookmarks.map((b) => b.questionId.toString());

    res.status(200).json({
      success: true,
      bookmarks: questionIds,
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookmarks." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   POST /api/bookmarks/:questionId
// @desc    Add a bookmark
// @access  Private
// ─────────────────────────────────────────────────────────
const addBookmark = async (req, res) => {
  try {
    // findOneAndUpdate with upsert = create if doesn't exist, ignore if already exists
    await Bookmark.findOneAndUpdate(
      { userId: req.user._id, questionId: req.params.questionId },
      { userId: req.user._id, questionId: req.params.questionId },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: "Bookmark added.",
    });
  } catch (error) {
    console.error("Add bookmark error:", error);
    res.status(500).json({ success: false, message: "Failed to add bookmark." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   DELETE /api/bookmarks/:questionId
// @desc    Remove a bookmark
// @access  Private
// ─────────────────────────────────────────────────────────
const removeBookmark = async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({
      userId: req.user._id,
      questionId: req.params.questionId,
    });

    res.status(200).json({
      success: true,
      message: "Bookmark removed.",
    });
  } catch (error) {
    console.error("Remove bookmark error:", error);
    res.status(500).json({ success: false, message: "Failed to remove bookmark." });
  }
};

module.exports = { getBookmarks, addBookmark, removeBookmark };
