const jwt = require("jsonwebtoken");

/**
 * contains logic related to access and refresh token, covers sending , clearing cookie logic
 * use http only cookie for storage.
 */

const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },                        
    process.env.JWT_SECRET,               
    { expiresIn: process.env.JWT_EXPIRES_IN } 
  );
};



const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const sendRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,     
    secure: process.env.NODE_ENV === "production", 
    sameSite: "none", // prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};


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
