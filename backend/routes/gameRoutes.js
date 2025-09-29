import express from 'express';
import Game from '../models/Game.js';
import Score from '../models/Score.js';
import authenticate from '../middleware/authMiddleware.js';
import axios from 'axios';

const router = express.Router();

// Fetch game data from DB or external API
router.get("/bash", authenticate, async (req, res) => {
  const { level } = req.query;

  try {
    const response = await axios.get("http://marcconrad.com/uob/banana/api.php?out=json");

    if (!response.data || !response.data.question || !response.data.solution) {
      return res.status(500).json({ message: "Failed to fetch game data" });
    }

    const gameData = new Game({
      level: parseInt(level),
      questionImage: response.data.question,
      correctAnswer: response.data.solution,
      options: Array.from({ length: 10 }, (_, i) => i)
    });

    await gameData.save();
    res.json(gameData);
  } catch (error) {
    console.error("Error fetching game data:", error);
    res.status(500).json({ message: "Failed to fetch game data" });
  }
});

// Submit answer endpoint
router.post('/answer', authenticate, async (req, res) => {
  const { questionId, selectedAnswer } = req.body;

  if (!questionId || selectedAnswer === undefined) {
    return res.status(400).json({ message: 'Invalid input. Both questionId and selectedAnswer are required.' });
  }

  try {
    const gameData = await Game.findById(questionId);

    if (!gameData) {
      return res.status(404).json({ message: 'Game data not found.' });
    }

    res.json({ correct: gameData.correctAnswer === selectedAnswer });
  } catch (error) {
    console.error('Error checking answer:', error);
    res.status(500).json({ message: 'Server error while checking the answer.' });
  }
});

// Submit score endpoint
router.post('/scoreboard', authenticate, async (req, res) => {
  const { username, level, points } = req.body;

  if (!username || !level || points === undefined) {
    return res.status(400).json({ message: 'Invalid input. All fields (username, level, points) are required.' });
  }

  try {
    const existingScore = await Score.findOne({ username, level });

    if (existingScore) {
      // ✅ Update only if new score is higher
      if (points > existingScore.points) {
        existingScore.points = points;
        await existingScore.save();
        return res.status(200).json({ message: 'Score updated successfully!', score: existingScore });
      } else {
        return res.status(200).json({ message: 'Score not higher. Not updated.', score: existingScore });
      }
    }

    // ✅ Find all scores for the level (max 2)
    const levelScores = await Score.find({ level }).sort({ points: 1 }); // ascending

    if (levelScores.length < 2) {
      // ✅ Less than 2 → Add it
      const newScore = new Score({ username, level, points });
      await newScore.save();
      return res.status(201).json({ message: 'Score submitted successfully!', score: newScore });
    } else {
      // ✅ 2 scores exist → Replace the lowest if new score is higher
      const lowestScore = levelScores[0];

      if (points > lowestScore.points) {
        await Score.findByIdAndDelete(lowestScore._id);

        const newScore = new Score({ username, level, points });
        await newScore.save();

        return res.status(201).json({ message: 'Score replaced lowest and saved!', score: newScore });
      } else {
        return res.status(200).json({ message: 'Not high enough to replace existing scores.' });
      }
    }

  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ message: 'Failed to submit score' });
  }
});



// Fetch top 2 highest scores per level
router.get('/scoreboard', authenticate, async (req, res) => {
  try {
    const scores = await Score.aggregate([
      {
        $group: {
          _id: { username: "$username", level: "$level" },
          points: { $max: "$points" }
        }
      },
      {
        $sort: { "_id.level": 1, points: -1 }
      }
    ]);

    const grouped = {};
    scores.forEach(score => {
      const level = score._id.level;
      if (!grouped[level]) grouped[level] = [];
      if (grouped[level].length < 2) { // ✅ Limit to top 2 per level
        grouped[level].push({
          username: score._id.username,
          points: score.points
        });
      }
    });

    console.log("✅ Sending grouped top 2 scores per level");
    res.json(grouped);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Failed to fetch scores" });
  }
});



export default router;
