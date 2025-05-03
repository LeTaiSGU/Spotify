import React from "react";
import BottomPlayer from "./BottomPlayer";
import "./layout.css";
import Rightbar from "../sidebar/rightbar/rightbar";
import Sidebar from "../sidebar/leftbar/sidebar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Layout = () => {
  const selectedSong = useSelector((state) => state.songs.selectedSong);
  const isRightbarVisible = useSelector(
    (state) => state.songs.isRightbarVisible
  );
  return (
    <div className="layout">
      <TopBar />
      <div className="main-container">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
        {selectedSong && isRightbarVisible && <Rightbar />}
      </div>
      <BottomPlayer />
    </div>
  );
};

export default Layout;
