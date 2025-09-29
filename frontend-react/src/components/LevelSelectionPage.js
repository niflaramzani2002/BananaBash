import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LevelSelectionPage.css";
import { IoClose } from "react-icons/io5"; // Import close icon

function LevelSelectionPage() {
  const navigate = useNavigate();

  const handleLevelSelect = (level) => {
    navigate(`/game?level=${level}`);
  };

  const handleClose = () => {
    navigate("/play"); // Navigate to Play Page
  };

  return (
    <div className="level-container">
      <div className="level-box">
        {/* Close button */}
        <button className="close-button" onClick={handleClose}>
          <IoClose size={30} />
        </button>

        <h1>Select a Level!</h1>

        {/* Container for level buttons */}
        <div className="selection-container">
          <div className="level-buttons">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                className="level-button"
                onClick={() => handleLevelSelect(level)}
              >
                Level {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LevelSelectionPage;
