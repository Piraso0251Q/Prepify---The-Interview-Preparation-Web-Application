const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── Public question routes (any logged-in user) ────────────
router.get("/",    protect, getQuestions);      // GET  /api/questions
router.get("/:id", protect, getQuestionById);   // GET  /api/questions/:id

// ── Admin-only routes ──────────────────────────────────────
// protect runs first (checks JWT), then adminOnly (checks isAdmin)
router.post(  "/admin",     protect, adminOnly, createQuestion);   // POST   /api/questions/admin
router.put(   "/admin/:id", protect, adminOnly, updateQuestion);   // PUT    /api/questions/admin/:id
router.delete("/admin/:id", protect, adminOnly, deleteQuestion);   // DELETE /api/questions/admin/:id

module.exports = router;
