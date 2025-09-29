import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5"; // Import close icon
import axios from "axios";
import "../styles/ScoreboardPage.css";

const ScoreboardPage = () => {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();
  const currentUsername = localStorage.getItem("username");

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }
     
        const response = await axios.get("http://localhost:5000/api/scoreboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log("Fetched Scores:", response.data);
        setScores(response.data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, [navigate]);

  const handleClose = () => {
    navigate("/play"); // Navigate back to home or another route when closing
  };

  return (
    <div className="scoreboard-page">
      <div className="scoreboard-container">
        {/* Close Button */}
        <button className="close-button" onClick={handleClose}>
          <IoClose size={30} />
        </button>

        <h1>Leaderboard</h1>
        <table className="scoreboard-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Level</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
  {[1, 2, 3, 4, 5].flatMap((level) => {
    if (!scores[level] || !Array.isArray(scores[level])) return [];

    const headerRow = (
      <tr className="level-header" key={`header-${level}`}>
        <td colSpan="3">🟨 Level {level}</td>
      </tr>
    );

    const userRows = scores[level].map((user, index) => (
      <tr
        key={`${level}-${user.username}`}
        className={user.username === currentUsername ? "highlighted-row" : ""}
      >
        <td>
          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''} {user.username}
        </td>
        <td>{level}</td>
        <td>{user.points}</td>
      </tr>
    ));

    return [headerRow, ...userRows];
  })}
</tbody>


        </table>
      </div>
    </div>
  );
};

export default ScoreboardPage;
