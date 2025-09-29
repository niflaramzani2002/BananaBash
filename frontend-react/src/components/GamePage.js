import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import '../styles/GamePage.css';

const GamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(70);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  //const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchGameData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const queryParams = new URLSearchParams(location.search);
        const level = parseInt(queryParams.get("level"), 10) || 1;

        const levelTimes = { 1: 70, 2: 60, 3: 50, 4: 40, 5: 30 };
        setTimeRemaining(levelTimes[level] || 70);

        const response = await axios.get("http://localhost:5000/api/game/bash", {
          headers: { Authorization: `Bearer ${token}` },
          params: { level }
        });

        if (!response.data || !response.data._id) {
          setError("No game data found.");
          return;
        }

        setGameData(response.data);
      } catch (error) {
        console.error("Error fetching game data:", error);
        setError("Failed to load game data.");
      }
    };

    fetchGameData();
  }, [location.search, navigate]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      Swal.fire({
        title: "Time's Up!",  
        text: "You ran out of time. Try again!",
        icon: "warning",
        confirmButtonText: "OK"
      }).then(() => navigate("/level"));
    }
  }, [timeRemaining, navigate]);

  const handleAnswerClick = async (answer) => {
    if (!gameData || !gameData._id) {
      console.error("Game data or questionId is missing!", gameData);
      return;
    }

    setSelectedAnswer(answer);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/game/answer", 
        { questionId: gameData._id, selectedAnswer: answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.correct) {
        const points = 100; // Adjust based on the game logic
        const username = localStorage.getItem("username");

        if (!username) {
          console.error("Username not found in localStorage");
          return;
        }

        const scoreData = { username: username, level: gameData.level, points: points };

        await axios.post("http://localhost:5000/api/scoreboard", scoreData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire({
          title: "Correct!",
          text: "Great job!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        }).then(() => navigate("/level"));
      } else {
        Swal.fire({
          title: "Wrong!",
          text: "Try again!",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      console.error("Error checking answer:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Try again!",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <div className="game-container">
      <div className="game-box">
        <h1 className="game-title">Banana Bash</h1>
        <div className="timer-container">
          <div className="timer">Time Remaining: {timeRemaining} sec</div>
          <button className="quit-button" onClick={() => navigate("/level")}>
            Quit
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {gameData ? (
          <div className="question-container">
            <img 
              className="game-image" 
              src={`${gameData.questionImage}?${new Date().getTime()}`}  // Add timestamp to force reload
              alt="Math Question" 
              style={{ width: "100%", height: "auto" }} 
            />
            <div className="answer-buttons">
              {gameData.options.map((option) => (
                <button
                  key={option}
                  className={`number-button ${selectedAnswer === option ? "selected" : ""}`}
                  onClick={() => handleAnswerClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="loading-message">Loading game data...</p>
        )}
      </div>
    </div>
  );
};

export default GamePage;
