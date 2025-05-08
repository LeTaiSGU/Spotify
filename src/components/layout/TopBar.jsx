import React from "react";
import "./TopBar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home, Search } from "lucide-react"; // Import các icon từ thư viện lucide-react
import { searchContent, setSearchLoading } from "../../redux/slice/searchSlice"; // Adjust the import based on your file structure

// Left Icon Group Component
const LeftIconGroup = () => {
  const navigate = useNavigate();

  const handleSpotifyClick = () => {
    navigate("/");
  };

  return (
    <div className="left-icons">
      <button className="top-bar-icon" onClick={handleSpotifyClick}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="#1DB954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      </button>
    </div>
  );
};

// Center Section Component (Home + Search Bar)
const CenterSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFocus = () => {
    setIsFocused(true);
  };

  const handleSearchBlur = () => {
    setIsFocused(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted with query:", searchQuery);

    if (searchQuery.trim()) {
      console.log("Search query is valid, dispatching actions");
      try {
        // Kiểm tra API có hoạt động không
        fetch(
          `http://localhost:8000/api/search/?q=${encodeURIComponent(
            searchQuery
          )}`
        )
          .then((response) => {
            console.log("API search test response status:", response.status);
            if (!response.ok) {
              console.error(
                "API không tồn tại hoặc có lỗi:",
                response.statusText
              );
            }
            return response.json();
          })
          .then((data) => {
            console.log("API search test data:", data);
          })
          .catch((err) => {
            console.error("API search test error:", err);
          });

        // Lưu từ khóa tìm kiếm để sử dụng ở SearchResults
        dispatch(setSearchLoading(true));
        dispatch(searchContent(searchQuery));

        // Điều hướng đến trang kết quả tìm kiếm
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);

        // Reset thanh tìm kiếm về trống
        setSearchQuery("");
      } catch (error) {
        console.error("Error during search dispatch:", error);
      }
    } else {
      console.log("Search query is empty, not searching");
    }
  };

  return (
    <div className="center-section">
      <button
        className={`top-bar-icon ${location.pathname === "/" ? "active" : ""}`}
        onClick={goToHome}
      >
        <Home size={20} />
      </button>
      <form onSubmit={handleSearchSubmit} className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          placeholder={!isFocused || !searchQuery ? "Bạn muốn nghe gì?" : ""}
          className="search-input"
        />
        <button type="submit" className="search-icon">
          <Search size={16} />
        </button>
      </form>
    </div>
  );
};

// Right Icon Group Component (Profile Icon + Menu)
const RightIconGroup = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth); // Lấy thông tin user từ Redux

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  const handleLogin = () => {
    navigate("/login"); // Điều hướng đến trang đăng nhập
  // Thêm các handler xử lý menu
  }

  const handleLogout = () => {
    // Xử lý logout ở đây nếu cần
    // Ví dụ: dispatch(logout());
    setIsMenuOpen(false);
    navigate("/login"); // Chuyển về trang login sau khi đăng xuất
  };

  return (
    <div className="right-icons">
      {user ? (
        // Hiển thị avatar và menu nếu đã đăng nhập
        <>
          <button className="profile-icon" onClick={toggleMenu}>
            <img src={user.avatar} alt="Profile" className="avatar" />
          </button>
          {isMenuOpen && (
            <div className="menu">
              <div className="menu-item">Account</div>
              <div className="menu-item" onClick={() => {navigate('/user'),setIsMenuOpen(false)}}>Profile</div>
              <div className="menu-item" onClick={handleLogout}>
                Log out
              </div>
            </div>
          )}
        </>
      ) : (
        // Hiển thị nút "Đăng nhập" nếu chưa đăng nhập
        <button className="login-button" onClick={handleLogin}>
          Đăng nhập
        </button>
      )}
    </div>
  );
};

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <LeftIconGroup />
        <CenterSection />
        <RightIconGroup />
      </div>
    </div>
  );
};

export default TopBar;
