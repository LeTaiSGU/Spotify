import React from "react";
import "./TopBar.css";
import LeftIconGroup from "./LeftIconGroup";
import CenterSection from "./CenterSection";
import RightIconGroup from "./RightIconGroup";

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
