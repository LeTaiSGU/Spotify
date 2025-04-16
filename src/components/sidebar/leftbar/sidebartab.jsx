// SidebarTabs.jsx
import React from "react";

const SidebarTabs = () => {
  return (
    <div className="flex gap-2 px-4 py-2">
      <button className="px-4 py-1.5 bg-zinc-800 rounded-full text-sm font-medium hover:bg-gray-700 text-white transition hover:cursor-pointer">
        Danh sách phát
      </button>
      <button className="px-4 py-1.5 bg-zinc-800 rounded-full text-sm font-medium hover:bg-gray-700 text-white transition hover:cursor-pointer">
        Album
      </button>
    </div>
  );
};

export default SidebarTabs;
