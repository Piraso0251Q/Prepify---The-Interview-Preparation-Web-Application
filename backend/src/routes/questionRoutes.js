const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  generateQuestions,
} = require("../controllers/questionController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// logged in user routes
router.get("/generate", protect, generateQuestions); 
router.get("/",    protect, getQuestions);      
router.get("/:id", protect, getQuestionById);   

// admin routes
router.post(  "/admin",     protect, adminOnly, createQuestion);  
router.put(   "/admin/:id", protect, adminOnly, updateQuestion);   
router.delete("/admin/:id", protect, adminOnly, deleteQuestion);   

module.exports = router;
