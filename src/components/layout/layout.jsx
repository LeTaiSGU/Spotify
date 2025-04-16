import React from "react";
import BottomPlayer from "./BottomPlayer";
import "./layout.css";
import PlaylistContent from "../playlist/playlistcontent";
import Rightbar from "../sidebar/rightbar/rightbar";
import Sidebar from "../sidebar/leftbar/sidebar";
import TopBar from "./TopBar";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full z-10">
        <TopBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden pt-16 pb-16">
        {/* Sidebar */}
        <Sidebar />
        <div className="main-content">
          <PlaylistContent />
          {/* <ContentPlaylist /> */}
          {/* <UserProfile /> */}
          <Outlet />
        </div>

        {/* Rightbar */}
        <Rightbar />
      </div>

      {/* Bottom Player */}
      <div className="fixed bottom-0 left-0 w-full z-10">
        <BottomPlayer />
      </div>
    </div>
  );
};

export default Layout;
