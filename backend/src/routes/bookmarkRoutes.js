const express = require("express");
const router = express.Router();
const { getBookmarks, addBookmark, removeBookmark } = require("../controllers/bookmarkController");
const { protect } = require("../middleware/authMiddleware");

// All bookmark routes are private
router.get(    "/",             protect, getBookmarks);   // GET    /api/bookmarks
router.post(   "/:questionId",  protect, addBookmark);    // POST   /api/bookmarks/:questionId
router.delete( "/:questionId",  protect, removeBookmark); // DELETE /api/bookmarks/:questionId

module.exports = router;
