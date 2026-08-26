const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Security & Parsing Middleware ──────────────────────────
app.use(helmet());           // Sets secure HTTP headers
app.use(cookieParser());     // Lets us read cookies (used for refresh token)
app.use(express.json());     // Lets us read JSON request bodies

// ── CORS — allow only the frontend origin ──────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL,   // http://localhost:5173
    credentials: true,                // needed so cookies are sent/received
  })
);

// ── Routes ─────────────────────────────────────────────────
const authRoutes      = require("./src/routes/authRoutes");
const questionRoutes  = require("./src/routes/questionRoutes");
const historyRoutes   = require("./src/routes/historyRoutes");
const bookmarkRoutes  = require("./src/routes/bookmarkRoutes");

app.use("/api/auth",      authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/history",   historyRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

// ── Health Check ───────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Prepify API is running ✅" });
});

// ── Global Error Handler ───────────────────────────────────
// This catches any error thrown anywhere using next(err)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
