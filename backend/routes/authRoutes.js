import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error during signup" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    // ✅ Send back token, userId, and profilePic
    res.json({
      token,
      userId: user._id,
      message: "Login successful!",
      profilePic: user.profilePic || null
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error during login" });
  }
});


// Profile picture update
router.post("/upload-profile", async (req, res) => {
  try {
    const { userId, profilePic } = req.body;
    if (!userId || !profilePic) {
      return res.status(400).json({ message: "userId and profilePic are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile picture updated!", profilePic: user.profilePic });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Failed to update profile picture" });
  }
});

export default router;
