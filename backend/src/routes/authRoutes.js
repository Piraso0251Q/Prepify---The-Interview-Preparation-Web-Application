const express = require("express");
const router = express.Router();
const { signup, login, logout, refresh, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes 
router.post("/signup",  signup);   
router.post("/login",   login);   
router.post("/refresh", refresh);  

// Private routes
router.post("/logout", protect, logout);  
router.get("/me",      protect, getMe);   

module.exports = router;
