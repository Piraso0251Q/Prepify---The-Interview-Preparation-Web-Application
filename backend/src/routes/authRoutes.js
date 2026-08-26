const express = require("express");
const router = express.Router();
const { signup, login, logout, refresh, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes — no token needed
router.post("/signup",  signup);   // POST /api/auth/signup
router.post("/login",   login);    // POST /api/auth/login
router.post("/refresh", refresh);  // POST /api/auth/refresh (uses cookie)

// Private routes — must be logged in (protect middleware runs first)
router.post("/logout", protect, logout);  // POST /api/auth/logout
router.get("/me",      protect, getMe);   // GET  /api/auth/me

module.exports = router;
