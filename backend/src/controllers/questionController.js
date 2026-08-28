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

// ─────────────────────────────────────────────────────────
// @route   GET /api/questions/generate
// @desc    Generate 5 unique questions via Groq AI & save to DB
// @access  Private (logged in users)
// ─────────────────────────────────────────────────────────
const { Groq } = require("groq-sdk");
const generateQuestions = async (req, res) => {
  try {
    const { role } = req.query;
    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required for generation." });
    }

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY not found. Falling back to database questions.");
      // Fallback: pick 10 random from DB if no API key
      const dbQuestions = await Question.aggregate([{ $match: { role } }, { $sample: { size: 10 } }]);
      return res.status(200).json({ success: true, questions: dbQuestions });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const prompt = `You are a technical interview system. Generate EXACTLY 5 unique, highly specific interview questions for a "${role}" role. 
    You MUST output exactly 5 questions. Ensure they are not generic. Output strictly in JSON format as an object with a "questions" array.
    Each question object MUST have exactly these keys:
    - title (string: the question itself)
    - description (string: 1 sentence providing context to the user)
    - role (string: exactly "${role}")
    - topic (string: specific tech topic, e.g. React, APIs, Performance)
    - difficulty (string: "Easy", "Medium", or "Hard")
    - modelAnswer (string: a highly detailed 3-5 sentence ideal answer)
    - explanation (string: 1 sentence explaining why interviewers ask this)
    - keywords (array of strings: 4-6 crucial technical terms expected in the answer)`;

    // Fetch 5 questions twice in parallel to avoid hitting the AI's maximum token limit for a single JSON block
    const [res1, res2] = await Promise.all([
      groq.chat.completions.create({
        messages: [{ role: "system", content: prompt }, { role: "user", content: "Generate batch 1" }],
        model: "openai/gpt-oss-20b",
        temperature: 0.8,
        response_format: { type: "json_object" },
      }).catch(e => ({ error: true })),
      groq.chat.completions.create({
        messages: [{ role: "system", content: prompt }, { role: "user", content: "Generate batch 2 (completely different from batch 1)" }],
        model: "openai/gpt-oss-20b",
        temperature: 0.9,
        response_format: { type: "json_object" },
      }).catch(e => ({ error: true }))
    ]);

    const safeParse = (res) => {
      if (res?.error || !res?.choices?.[0]?.message?.content) return [];
      try {
        return JSON.parse(res.choices[0].message.content).questions || [];
      } catch (e) {
        console.error("JSON parse error for batch:", e);
        return [];
      }
    };

    const parsed1 = safeParse(res1);
    const parsed2 = safeParse(res2);
    
    let combinedQuestions = [...parsed1, ...parsed2];

    // Sanitize the newly generated AI output
    const newQuestions = combinedQuestions.map(q => ({
      title: q.title || "Untitled Question",
      description: q.description || "",
      role: role, 
      topic: q.topic || "General",
      difficulty: ["Easy", "Medium", "Hard"].includes(q.difficulty) ? q.difficulty : "Medium",
      modelAnswer: q.modelAnswer || "No answer provided.",
      explanation: q.explanation || "",
      keywords: Array.isArray(q.keywords) ? q.keywords : [],
    }));

    // Save only the newly generated valid AI questions
    let finalQuestions = [];
    if (newQuestions.length > 0) {
       finalQuestions = await Question.insertMany(newQuestions);
    }

    // Force exact 10 output. Slice if > 10, pad with DB if < 10
    if (finalQuestions.length > 10) {
      finalQuestions = finalQuestions.slice(0, 10);
    } else if (finalQuestions.length < 10) {
      console.log(`AI only generated ${finalQuestions.length} valid questions. Padding with DB questions.`);
      const needed = 10 - finalQuestions.length;
      const dbPad = await Question.aggregate([
        { $match: { role } }, 
        { $sample: { size: needed } }
      ]);
      finalQuestions = [...finalQuestions, ...dbPad];
    }

    res.status(200).json({
      success: true,
      questions: finalQuestions,
    });
  } catch (error) {
    console.error("Generate questions error Details:", error);
    res.status(500).json({ success: false, message: "Failed to generate questions." });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  generateQuestions,
};
