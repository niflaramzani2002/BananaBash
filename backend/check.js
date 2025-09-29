import mongoose from 'mongoose';
import Scoreboard from './models/Score.js';

mongoose.connect('mongodb://localhost:27017/banana-bash', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const newScore = new Scoreboard({
      username: 'player1',
      points: 100,
      level: 3
    });
    return newScore.save();
  })
  .then(() => console.log("Mock data inserted"))
  .catch(err => console.error("Error inserting mock data:", err));
