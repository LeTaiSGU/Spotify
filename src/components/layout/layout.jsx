import React, { useState, useEffect } from "react";
import BottomPlayer from "./BottomPlayer";
import "./layout.css";
import Rightbar from "../sidebar/rightbar/rightbar";
import Sidebar from "../sidebar/leftbar/sidebar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatBox from "../chatbox/chatbox";

const Layout = () => {
  const selectedSong = useSelector((state) => state.songs.selectedSong);
  const isRightbarVisible = useSelector(
    (state) => state.songs.isRightbarVisible
  );
  const [showChat, setShowChat] = useState(false);

  // Thêm effect để vô hiệu hóa scroll của body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <TopBar />
      <div className="main-container">
        <Sidebar />
        <div className="main-content custom-scrollbar pb-[90px]">
          <Outlet />
        </div>
        {selectedSong && isRightbarVisible && <Rightbar />}
      </div>

      <div className="fixed bottom-0 left-0 w-full z-10">
        <BottomPlayer />
      </div>

      <div className="fixed bottom-20 right-4 z-50">
        {showChat ? (
          <ChatBox onClose={() => setShowChat(false)} />
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="bg-[#1DB954] text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-600 transition"
            title="Mở chat"
          >
            💬
          </button>
        )}
      </div>
    </div>
  );
};

export default Layout;
