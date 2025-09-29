import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/HomePage.css";
import monkeyImage from "../images/Monkey1.jpg";

function HomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Password check on Sign Up
    if (!isLogin && password !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'Passwords do not match!',
      });
      return;
    }

    const endpoint = isLogin ? "login" : "signup";
    const requestData = { username, password };

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // ✅ Store session
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("profilePic", data.profilePic || "");
          localStorage.setItem("username", username);

          // ✅ Show success popup
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: `Welcome back, ${username}!`,
            timer: 2000,
            showConfirmButton: false,
          });

          setTimeout(() => navigate("/play"), 2000);
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Signup Successful!',
            text: 'You can now log in.',
            timer: 2000,
            showConfirmButton: false,
          });

          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: data.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Failed to connect to the server.',
      });
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="home-page">
      <div className="content">
        <div className="left-side">
          <h1>Banana Bash</h1>
          <p>Welcome to the Banana Math Game! Test your math skills while having fun!</p>
          <img src={monkeyImage} alt="Monkey" />
        </div>

        <div className="right-side">
          <form onSubmit={handleSubmit}>
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {/* Only show Confirm Password on Signup */}
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                {confirmPassword && confirmPassword !== password && (
                  <p style={{ color: 'red', fontSize: '12px' }}>Passwords do not match</p>
                )}
              </div>
            )}

            <button type="submit" className="sign-up-button">
              {isLogin ? "Login" : "Sign Up"}
            </button>

            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"} 
              <button type="button" className="login-button" onClick={toggleForm}>
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
