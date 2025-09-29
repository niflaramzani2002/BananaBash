import Game from "../models/Game.js";
import axios from "axios";

export const getGameData = async (level) => {
    const gameData = await Game.findOne({ level }).select("_id questionImage options correctAnswer level").exec();
    
    if (!gameData) {
        const bananaApiUrl = "http://marcconrad.com/uob/banana/api.php?out=json";
        const apiResponse = await axios.get(bananaApiUrl);

        if (!apiResponse.data || !apiResponse.data.question || !apiResponse.data.solution) {
            throw new Error("Failed to fetch question from Banana API");
        }

        const options = [
            apiResponse.data.solution,
            apiResponse.data.solution + Math.floor(Math.random() * 10) + 1,
            apiResponse.data.solution - Math.floor(Math.random() * 10) - 1,
            apiResponse.data.solution + Math.floor(Math.random() * 5) + 2
        ].sort(() => Math.random() - 0.5);

        const newQuestion = new Game({
            level,
            questionImage: apiResponse.data.question,
            options,
            correctAnswer: apiResponse.data.solution
        });

        await newQuestion.save();
        return newQuestion;
    }

    return gameData;
};

export const checkAnswer = async (questionId, selectedAnswer) => {
    const question = await Game.findById(questionId).exec();
    if (!question) {
        throw new Error("Question not found");
    }

    return String(question.correctAnswer) === String(selectedAnswer);
};
