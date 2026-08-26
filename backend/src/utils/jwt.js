const jwt = require("jsonwebtoken");

// ── Generate short-lived Access Token (15 minutes) ────────
// This is what the frontend uses to call protected APIs
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },                        // payload: what we store in the token
    process.env.JWT_SECRET,                // secret key from .env
    { expiresIn: process.env.JWT_EXPIRES_IN } // expires in 15 minutes
  );
};

// ── Generate long-lived Refresh Token (7 days) ────────────
// This is stored in an httpOnly cookie — used to get a new access token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

// ── Verify a token and return the decoded payload ─────────
// Returns the decoded payload { id, iat, exp } or throws an error
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

// ── Send the refresh token as a secure httpOnly cookie ────
// httpOnly = JavaScript cannot read it (protects against XSS attacks)
const sendRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,     // JS cannot access this cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// ── Clear the refresh token cookie on logout ─────────────
const clearRefreshTokenCookie = (res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // expire immediately
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  sendRefreshTokenCookie,
  clearRefreshTokenCookie,
};
