// // routes/authRoutes.js
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");        // ✅ lowercase
// const UserRole = require("../models/UserRole"); 
// require("dotenv").config();

// const router = express.Router();

// // ✅ REGISTER ROUTE
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, roleId } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: "Email already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword, roleId });
//     await user.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ✅ LOGIN ROUTE
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email })
//       .populate("roleId")
//       .populate("labId"); // optional if you use labId

//     if (!user) return res.status(400).json({ error: "Invalid email" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid password" });

//     // ✅ Safe token generation (handles both populated and non-populated roleId)
//     const token = jwt.sign(
//       {
//         id: user._id,
//         roleId: user.roleId?._id?.toString() || user.roleId.toString(),
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "4d" }
//     );

//     res.json({ message: "Login successful", token, user });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ✅ GET CURRENT USER
// router.get("/user", async (req, res) => {
//   try {
//     const authHeader = req.header("Authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "Access denied. No token provided." });
//     }

//     const token = authHeader.replace("Bearer ", "");
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) return res.status(401).json({ error: "Invalid token" });

//     const user = await User.findById(decoded.id)
//       .select("-password")
//       .populate("roleId")
//       .populate("labId");

//     if (!user) return res.status(404).json({ error: "User not found" });

//     res.json(user);
//   } catch (error) {
//     console.error("Get user error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;

// routes/authRoutes.js
// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");

const UserRole = require("../models/UserRoleModel");
require("dotenv").config();

const router = express.Router();
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).populate('roleId');
    if (!user)
      return res.status(400).json({ error: 'Invalid email or password' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid email or password' });

    // Generate token
    const token = jwt.sign(
      { id: user._id, roleId: user.roleId._id },
      process.env.JWT_SECRET,
      { expiresIn: '4d' }
    );

    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Login Route
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
      { id: user._id, roleId: user.roleId._id },
      process.env.JWT_SECRET,
      { expiresIn: "4d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Logged-in User Data
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
