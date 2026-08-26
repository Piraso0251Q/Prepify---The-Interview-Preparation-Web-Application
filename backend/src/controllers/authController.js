const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  sendRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require("../utils/jwt");

// ── Helper: format user object to send to frontend ────────
// We never send passwordHash, refreshToken, __v etc.
const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  isAdmin: user.isAdmin,
  joinedAt: user.createdAt,
  subscription: user.subscription,
});

// ─────────────────────────────────────────────────────────
// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
// ─────────────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // 2. Check if email is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // 3. Generate avatar initials from name (e.g. "Alex Chen" → "AC")
    const avatar = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // 4. Create user in DB
    // Note: passwordHash pre-save hook will hash the password automatically
    const user = await User.create({
      name,
      email,
      passwordHash: password, // the hook hashes this before saving
      avatar,
    });

    // 5. Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 6. Save refresh token to DB (so we can invalidate it on logout)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 7. Send refresh token as httpOnly cookie
    sendRefreshTokenCookie(res, refreshToken);

    // 8. Respond with user data + access token
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      accessToken,
      user: formatUser(user),
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error during signup." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login user, return tokens
// @access  Public
// ─────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // 2. Find user — we use .select("+passwordHash") because it's hidden by default
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 3. Compare entered password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 4. Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 5. Save new refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 6. Send refresh token cookie
    sendRefreshTokenCookie(res, refreshToken);

    // 7. Respond
    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      accessToken,
      user: formatUser(user),
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   POST /api/auth/logout
// @desc    Logout — clear refresh token
// @access  Private (must be logged in)
// ─────────────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    // 1. Clear refresh token from DB for this user
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    // 2. Clear the httpOnly cookie
    clearRefreshTokenCookie(res);

    res.status(200).json({ success: true, message: "Logged out successfully." });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error during logout." });
  }
};

// ─────────────────────────────────────────────────────────
// @route   POST /api/auth/refresh
// @desc    Get a new access token using refresh token cookie
// @access  Public (uses cookie, no access token needed)
// ─────────────────────────────────────────────────────────
const refresh = async (req, res) => {
  try {
    // 1. Read the refresh token from the httpOnly cookie
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token. Please log in.",
      });
    }

    // 2. Verify the refresh token
    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);

    // 3. Find user and check the refresh token matches what we stored in DB
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token. Please log in again.",
      });
    }

    // 4. Issue a new access token
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.error("Refresh error:", error);
    res.status(401).json({
      success: false,
      message: "Refresh token expired. Please log in again.",
    });
  }
};

// ─────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get currently logged-in user's data
// @access  Private (requires access token)
// ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // req.user is already set by the `protect` middleware
    res.status(200).json({
      success: true,
      user: formatUser(req.user),
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { signup, login, logout, refresh, getMe };
