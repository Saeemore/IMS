// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const UserRole = require("../models/UserRoleModel");
require("dotenv").config();

const router = express.Router();

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).populate("roleId");
    if (!user) return res.status(400).json({ error: "Invalid email" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // Generate token
    const token = jwt.sign(
      { id: user._id, roleId: user.roleId?._id },
      process.env.JWT_SECRET,
      { expiresIn: "4d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ✅ GET LOGGED-IN USER DATA
router.get("/user", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied. No token." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ error: "Invalid token" });

    const user = await User.findById(decoded.id).select("-password").populate("roleId");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;