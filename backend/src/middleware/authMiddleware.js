const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");

// ── Protect: only logged-in users can access ──────────────
// Usage: add `protect` before any route handler you want to secure
const protect = async (req, res, next) => {
  try {
    // 1. Get the token from the Authorization header
    // Frontend sends: Authorization: Bearer <accessToken>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1]; // extract just the token part

    // 2. Verify the token is valid and not expired
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    // 3. Find the user in DB and attach to req.user
    // This makes req.user available in all downstream controllers
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    req.user = user;
    next(); // move on to the actual route handler

  } catch (error) {
    // jwt.verify throws if token is invalid or expired
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired. Please log in again.",
    });
  }
};

// ── Admin Only: protect + must be admin ───────────────────
// Usage: add `adminOnly` after `protect` on admin routes
const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
  next();
};

module.exports = { protect, adminOnly };
