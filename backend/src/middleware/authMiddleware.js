const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");

/**
 * Auth middleware  logic for authorization purpose, verify token
 */

const protect = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1]; 

    const decoded = verifyToken(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    req.user = user;
    next(); 

  } catch (error) {
    
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired. Please log in again.",
    });
  }
};


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
