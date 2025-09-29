import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Header.css"; // Import your CSS for styling the header

const Header = () => {
  const [username, setUsername] = useState(""); // State to store the username
  const [profileImage, setProfileImage] = useState(null); // State to store the uploaded image
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State for showing the dropdown
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // To reset the file input after selection
  const navigate = useNavigate();

  // Fetch the username and profile image from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage

        if (!token) {
          navigate("/"); // Redirect if no token is found (user is not logged in)
          return;
        }

        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(response.data.username); // Set the username in the state
        setProfileImage(response.data.profileImage); // Set the profile image in the state (if available)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // Preview the selected image
      uploadProfileImage(file); // Upload the selected image to the backend
    }
  };

  const handleEditProfile = () => {
    // Trigger the file input change event
    document.getElementById("profile-image-input").click();
  };

  const uploadProfileImage = async (file) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/"); // Redirect if no token is found
        return;
      }

      const formData = new FormData();
      formData.append("file", file); // Append the image file to the form data

      const response = await axios.put(
        "/api/profile", // Backend route to update profile
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Tell backend it's a file upload
          },
        }
      );

      console.log(response.data); // Optionally log the response (e.g., success message)
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/"); // Redirect to homepage after logout
  };

  return (
    <header className="header">
      <div className="right-icons">
        {/* Profile Icon */}
        <div className="icon" onClick={toggleDropdown}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" /> // Display selected image
          ) : (
            <img src="/default-profile.png" alt="Profile" /> // Default image if not set
          )}
        </div>
        {isDropdownVisible && (
          <div className="profile-dropdown">
            <div className="profile-info">
              <p><strong>{username}</strong></p> {/* Display the username */}
            </div>
            <button onClick={handleEditProfile}>Edit Profile</button>
            <button onClick={handleLogout}>Logout</button>

            {/* Hidden file input field for selecting a file */}
            <input
              type="file"
              id="profile-image-input"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange} // Handle file change
              key={fileInputKey} // Reset the file input when the key changes
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
