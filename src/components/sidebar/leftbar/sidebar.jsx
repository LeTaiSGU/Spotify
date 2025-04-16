// Sidebar.jsx
import React, { useState } from "react";
import SidebarHeader from "./sidebarheader";
import SidebarTabs from "./sidebartab";
import SidebarSearchFilter from "./sidebarfilter";
import SidebarPlaylists from "./playlistsitem";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const playlists = [
    {
      id: "1",
      title: "Bài hát đã thích",
      type: "Danh sách phát",
      creator: "2 bài hát",
      isLiked: true,
      coverUrl: "/placeholder.svg?height=60&width=60",
      addedDate: "28 thg10,2021",
      lastPlayed: "23 phút trước",
    },
    {
      id: "2",
      title: "Rap On Trap",
      type: "Danh sách phát",
      creator: "Xavi Lê",
      coverUrl: "/placeholder.svg",
      addedDate: "",
      lastPlayed: "5 phút trước",
    },
    {
      id: "3",
      title: "Minecraft: Soothing Synchronization",
      type: "EP",
      creator: "Minecraft",
      coverUrl: "/placeholder.svg",
      addedDate: "4 thg1,2024",
      lastPlayed: "2 ngày trước",
    },
    {
      id: "4",
      title: "Synthwave - beats to chill relax",
      type: "Danh sách phát",
      creator: "Lofi Girl",
      coverUrl: "/placeholder.svg",
      addedDate: "29 thg10,2021",
      lastPlayed: "1 giờ trước",
    },
    {
      id: "5",
      title: "My Playlist #2",
      type: "Danh sách phát",
      creator: "Xavi Lê",
      coverUrl: "/placeholder.svg",
      addedDate: "29 thg10,2021",
      lastPlayed: "30 phút trước",
    },
  ];

  return (
    <div
      className={`flex flex-col h-full transition-[width] duration-300 ${
        isExpanded ? "w-[25%]" : "w-[20%]"
      } mx-2 bg-stone-900 rounded-xl text-white`}
    >
      <SidebarHeader onToggle={toggleSidebar} isExpanded={isExpanded} />

      {isExpanded ? (
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <SidebarTabs />
          <SidebarSearchFilter />
        </div>
      ) : (
        <>
          <SidebarTabs />
          <SidebarSearchFilter isExpanded={false} />
        </>
      )}

      <SidebarPlaylists playlists={playlists} isExpanded={isExpanded} />
    </div>
  );
};

export default Sidebar;
