import { useState } from "react";
import { FaPlay, FaEllipsisH } from "react-icons/fa";
import { useSidebar } from "../../hooks/useSidebar";

const PlaylistSidebar = () => {
  const [selected, setSelected] = useState("All");
  const filters = ["All", "Music", "Podcasts"];
  const { isExplored, setIsExplored } = useSidebar();

  return (
    <div className="flex flex-col items-start p-4 w-full">
      <div className="flex space-x-2">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
    selected === filter
      ? "bg-white text-black"
      : "bg-gray-700 text-white hover:bg-gray-500"
  }`}
            onClick={() => setSelected(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaylistSidebar;
