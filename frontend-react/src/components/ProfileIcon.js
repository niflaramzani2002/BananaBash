import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ProfileIcon.css';
import axios from 'axios';
import Swal from "sweetalert2";

const ProfileIcon = () => {
  const location = useLocation();
  const [image, setImage] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setShouldShow(location.pathname !== '/');
    const stored = localStorage.getItem('profilePic');
    if (stored) setImage(stored);
  }, [location.pathname]);

  const handleEdit = () => document.getElementById('uploadInput').click();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setImage(base64);
      localStorage.setItem('profilePic', base64);

      if (userId) {
        try {
          await axios.post("http://localhost:5000/api/auth/upload-profile", {
            userId,
            profilePic: base64,
          });
        } catch (err) {
          console.error("Upload failed", err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImage(null);
    localStorage.removeItem('profilePic');

    if (userId) {
      axios.post("http://localhost:5000/api/auth/remove-profile", {
        userId,
      }).catch(err => console.error("Remove failed", err));
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5a4a2e',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = '/';
      }
    });
  };

  if (!shouldShow) return null;

  // Avatar colors for initials
  const colors = ["#F5A623", "#50E3C2", "#B8E986", "#7ED321", "#F8E71C", "#F9A1BC", "#F5B7B1"];
  const avatarColor = colors[username.length % colors.length];
  const initials = username.charAt(0).toUpperCase();

  return (
    <div className="profile-icon-wrapper">
      <div className="profile-icon" onClick={() => setShowOptions(!showOptions)}>
        {image ? (
          <img src={image} alt="Profile" />
        ) : (
          <div className="avatar-placeholder" style={{ backgroundColor: avatarColor }}>
            {initials}
          </div>
        )}
      </div>
      {showOptions && (
        <div className="profile-options">
          <button onClick={handleEdit}>Edit Profile</button>
          <button onClick={handleRemove}>Remove Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <input
        id="uploadInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default ProfileIcon;
