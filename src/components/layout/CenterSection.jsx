import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";

const CenterSection = () => {
  const [searchQuery, setSearchQuery] = useState("What do you want to play?");
  const location = useLocation();
  const navigate = useNavigate();

  const goToHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value || "What do you want to play?");
  };

  const handleSearchFocus = () => {
    if (searchQuery === "What do you want to play?") {
      setSearchQuery("");
    }
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setSearchQuery("What do you want to play?");
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
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          className="search-input"
        />
        <button className="search-icon">
          <Search size={16} />
        </button>
      </div>
    </div>
  );
};

export default CenterSection;
