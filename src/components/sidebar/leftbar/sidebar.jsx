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

      <SidebarPlaylists isExpanded={isExpanded} />
    </div>
  );
};

export default Sidebar;
