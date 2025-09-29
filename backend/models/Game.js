// models/Game.js
import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  questionImage: { type: String, required: true },
  correctAnswer: { type: Number, required: true },
  options: [{ type: Number, required: true }]
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);
export default Game;
