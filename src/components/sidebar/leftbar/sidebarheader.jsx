// SidebarHeader.jsx
import React from "react";
import { Plus, ArrowRight } from "lucide-react";
import { VscLibrary } from "react-icons/vsc";

const SidebarHeader = ({ onToggle, isExpanded }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2 hover:cursor-pointer hover:text-gray-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition duration-300">
        <VscLibrary className="text-2xl" />
        <h1 className="text-lg font-semibold">Thư viện</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-gray-700 text-white transition hover:cursor-pointer">
          <Plus size={16} />
          <span className="text-sm font-semibold">Tạo</span>
        </button>
        <button
          onClick={onToggle}
          className="p-2 rounded-full hover:bg-gray-700 transition-transform duration-200"
        >
          <ArrowRight
            size={20}
            className={`${
              isExpanded ? "rotate-180" : ""
            } transition-transform duration-300`}
          />
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
