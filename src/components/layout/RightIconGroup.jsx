import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import avatar from "../../assets/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slice/authSlice";

const RightIconGroup = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const toggleMenu = () => {
    setIsMenuOpen(false);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigateToAccount = () => {
    setIsMenuOpen(false);
    navigate("/account"); // Navigate to /account
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
      // Clear chat messages from localStorage
      localStorage.removeItem("chatMessages");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/signup");
  };

  return (



    <div className=" right-icons flex items-center">
      {!user ? (
        <div className="flex gap-4">
          <button
            className="px-5 py-2 rounded-full font-semibold text-sm text-white border border-white bg-transparent hover:bg-white/10 hover:scale-105 transition-all duration-200"
            onClick={handleRegisterClick}
          >
            Đăng ký
          </button>
          <button
            className="px-5 py-2 rounded-full font-semibold text-sm text-black bg-white hover:bg-gray-100 hover:scale-105 transition-all duration-200"
            onClick={handleLoginClick}
          >
            Đăng nhập
          </button>
        </div>
      ) : (
        <>
          <button className="profile-icon" onClick={toggleMenu}>
            <img src={user.avatar} alt="Profile" className="avatar" />
          </button>
          {isMenuOpen && (
            <div className="menu">
              <div className="menu-item" onClick={handleNavigateToAccount}>
                Account
              </div>
              <div className="menu-item" onClick={handleNavigateToProfile}>
                Profile
              </div>
              <div className="menu-item" onClick={handleLogout}>
                Log out
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RightIconGroup;
