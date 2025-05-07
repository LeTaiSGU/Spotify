import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/avatar.png";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slice/authSlice";

const RightIconGroup = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(false);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigateToProfile = () => {
    setIsMenuOpen(false);
    navigate("/user"); // Navigate to /user
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      // Use the async thunk to handle logout API call
      await dispatch(logoutUser()).unwrap();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="right-icons">
      <button className="profile-icon" onClick={toggleMenu}>
        <img src={avatar} alt="Profile" className="avatar" />
      </button>
      {isMenuOpen && (
        <div className="menu">
          <div className="menu-item">Account</div>
          <div className="menu-item" onClick={handleNavigateToProfile}>
            Profile
          </div>
          <div className="menu-item" onClick={handleLogout}>
            Log out
          </div>
        </div>
      )}
    </div>
  );
};

export default RightIconGroup;
