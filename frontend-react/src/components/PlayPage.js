import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PlayPage.css";
import { X } from "lucide-react";

function PlayPage() {
  const navigate = useNavigate();

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token"); // Check if token exists
    if (!token) {
      // If not authenticated, redirect to the home page
      navigate("/"); // Redirect to HomePage
    }
  }, [navigate]);

  // Remove authentication token when PlayPage loads
  useEffect(() => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
  }, []);

  const handlePlay = () => {
    navigate("/level"); // Navigate to Level page
  };

  const handleScoreboard = () => {
    navigate("/scoreboard"); // Navigate to Scoreboard page
  };

  const handleSettings = () => {
    navigate("/settings"); // Navigate to Settings page
  };

  const handleClose = () => {
    navigate("/"); // Navigate to Home page
  };

  return (
    <div className="play-page">
      <div className="contentP">
        <button className="close-icon" onClick={handleClose}>
          <X size={24} />
        </button>

        <h1 className="game-title">Banana Bash</h1>
        <p className="game-description">
          Hey there! Ready for some math fun? <br />
          Click Play and solve as many problems as you can before time runs out!
        </p>
        <div className="button-container">
          <button className="play-button" onClick={handlePlay}>Play</button>
          <button className="scoreboard-button" onClick={handleScoreboard}>ScoreBoard</button>
          <button className="settings-button" onClick={handleSettings}>Settings</button>
        </div>
      </div>
    </div>
  );
}

export default PlayPage;
