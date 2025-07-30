const jwt = require("jsonwebtoken");
const User = require("../models/UserModel"); // Adjust path if needed
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user; // Make user available in protected routes
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Token invalid or expired" });
  }
};

module.exports = authMiddleware;
