const express = require("express");
const router = express.Router();
const { saveSession, getSessions, getSessionById, clearHistory } = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");

// All history routes are private (must be logged in)
router.post(  "/",    protect, saveSession);     // POST   /api/history        → save session
router.get(   "/",    protect, getSessions);     // GET    /api/history        → get all sessions
router.get(   "/:id", protect, getSessionById);  // GET    /api/history/:id    → get one session
router.delete("/",    protect, clearHistory);    // DELETE /api/history        → clear all

module.exports = router;
