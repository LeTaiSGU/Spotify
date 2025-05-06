import React from "react";
import BottomPlayer from "./BottomPlayer";
import "./layout.css";
import Rightbar from "../sidebar/rightbar/rightbar";
import Sidebar from "../sidebar/leftbar/sidebar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="layout">
      <TopBar />
      <div className="main-container">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
        {/* <Rightbar /> */}
      </div>
      <BottomPlayer />
    </div>
  );
};

export default Layout;
