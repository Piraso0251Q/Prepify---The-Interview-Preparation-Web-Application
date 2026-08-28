const Bookmark = require("../models/Bookmark");

/**
 * contains business logic for bookmark feature 
 */

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id });

    
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

const addBookmark = async (req, res) => {
  try {
    
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
