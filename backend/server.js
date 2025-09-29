// server.js

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Authentication routes
import gameRoutes from './routes/gameRoutes.js'; // Game-related routes
import scoreboardRoutes from './routes/scoreboardRoutes.js'; // Scoreboard routes

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Allow requests from frontend
app.use(cors({
  origin: "*",  // Allow all origins temporarily for testing
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Middleware
app.use(express.json()); // Body parser for JSON requests

// ✅ MongoDB Connection with Debugging
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Connection Error:", err);
});

// API routes
app.use("/api/game", gameRoutes); // Game routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/scoreboard", scoreboardRoutes); // Scoreboard routes

// API endpoint to fetch data from the Banana API
app.get('/api/game/bash', async (req, res) => {
  try {
    // Fetching data from the external Banana API
    const response = await axios.get("http://marcconrad.com/uob/banana/api.php?out=json");
    
    // Sending back the fetched data
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching game data:", error);
    res.status(500).json({ message: "Failed to fetch game data" });
  }
});

// ✅ Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
