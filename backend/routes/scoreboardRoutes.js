import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import Score from "../models/Score.js"; // ✅ Import the Score model

const router = express.Router();

// Define the route for fetching the scoreboard data
router.get("/", authenticate, async (req, res) => {
  try {
    const scores = await Score.aggregate([
      {
        $group: {
          _id: { level: "$level", username: "$username" },
          points: { $max: "$points" }
        }
      },
      { $sort: { "_id.level": 1, points: -1 } }
    ]);

    const grouped = {};
    scores.forEach(score => {
      const level = score._id.level;
      if (!grouped[level]) grouped[level] = [];
      if (grouped[level].length < 5) {
        grouped[level].push({
          username: score._id.username,
          points: score.points
        });
      }
    });

    
    res.json(grouped);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Failed to fetch scores" });
  }
});


router.post('/', authenticate, async (req, res) => {
  const { username, level, points } = req.body;

  if (!username || !level || points === undefined) {
    return res.status(400).json({ message: 'Invalid input. All fields (username, level, points) are required.' });
  }

  try {
    // Check if the username already has a score entry
    let existingScore = await Score.findOne({ username, level });

    if (existingScore) {
      // If the score exists, update it
      existingScore.points += points; // Add the new points to the existing score
      await existingScore.save(); // Save the updated score
      res.status(200).json({ message: 'Score updated successfully!', score: existingScore });
    } else {
      // If no score entry exists, create a new one
      const newScore = new Score({
        username,
        level,
        points,
      });
      await newScore.save();
      res.status(201).json({ message: 'Score submitted successfully!', score: newScore });
    }
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ message: 'Failed to submit score' });
  }
});

  
export default router;
