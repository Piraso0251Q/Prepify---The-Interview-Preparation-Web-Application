const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  sendRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require("../utils/jwt");


/**
 * contains business logic for auth feature 
 */

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


const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

  
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


    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

   
    const avatar = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);


    const user = await User.create({
      name,
      email,
      passwordHash: password, 
      avatar,
    });

   
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

 
    sendRefreshTokenCookie(res, refreshToken);

    
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


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

   
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

   
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

  
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

 
    sendRefreshTokenCookie(res, refreshToken);

    
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


const logout = async (req, res) => {
  try {
    
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

   
    clearRefreshTokenCookie(res);

    res.status(200).json({ success: true, message: "Logged out successfully." });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error during logout." });
  }
};


const refresh = async (req, res) => {
  try {
    
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token. Please log in.",
      });
    }

    
    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);

    
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token. Please log in again.",
      });
    }

    
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


const getMe = async (req, res) => {
  try {
    
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
