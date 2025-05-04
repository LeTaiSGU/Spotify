// SidebarSearchFilter.jsx
import React from "react";
import { Search, List } from "lucide-react";

const SidebarSearchFilter = ({ isExpanded = true }) => {
  return (
    <div
      className={`flex items-center ${
        isExpanded ? "gap-1" : "justify-between p-4"
      }`}
    >
      <button className="p-2 rounded-full hover:bg-gray-700 hover:cursor-pointer">
        <Search size={20} />
      </button>
      <div className="flex items-center gap-1">
        <button className="flex items-center gap-2 p-1 rounded-full group transition-all duration-300">
          <span className="text-sm text-zinc-400 group-hover:text-white group-hover:scale-110 transform transition-all duration-300">
            Gần đây
          </span>
          <List
            size={20}
            className="text-zinc-400 group-hover:text-white group-hover:scale-110 transform transition-all duration-300"
          />
        </button>
      </div>
    </div>
  );
};

export default SidebarSearchFilter;
