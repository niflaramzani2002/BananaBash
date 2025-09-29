import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Settings.css";
import { X } from "lucide-react"; // Import X icon
import { MusicContext } from "../context/MusicContext"; // Use Music Context

const Settings = () => {
  const { isMusicOn, setIsMusicOn } = useContext(MusicContext); // Get from context
  const [isVibrationOn, setIsVibrationOn] = useState(
    localStorage.getItem("isVibrationOn") === "true"
  );
  const navigate = useNavigate();

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      // If token is not found, redirect to home page
      navigate("/");
    }
  }, [navigate]);

  const toggleMusic = () => setIsMusicOn((prev) => !prev); // Use global music toggle

  const toggleVibration = () => {
    setIsVibrationOn((prev) => !prev);
    localStorage.setItem("isVibrationOn", !isVibrationOn);

    if (navigator.vibrate) {
      !isVibrationOn ? navigator.vibrate(200) : navigator.vibrate(0);
    } else {
      console.log("Vibration is not supported on this device.");
    }
  };

  const handleBackToPlay = () => {
    navigate("/play"); // Navigate back to PlayPage.js
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <button className="close-icon" onClick={handleBackToPlay}>
          <X size={24} />
        </button>

        <h1>Settings</h1>

        <div className="setting-option">
          <label>🎵 Music</label>
          <button className={`toggle-button ${isMusicOn ? "on" : "off"}`} onClick={toggleMusic}>
            {isMusicOn ? "On" : "Off"}
          </button>
        </div>

        <div className="setting-option">
          <label>📳 Vibration</label>
          <button className={`toggle-button ${isVibrationOn ? "on" : "off"}`} onClick={toggleVibration}>
            {isVibrationOn ? "On" : "Off"}
          </button>
        </div>

        

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Settings;
