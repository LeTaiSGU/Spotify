// SidebarHeader.jsx
import React from "react";
import { Plus, ArrowRight } from "lucide-react";
import { VscLibrary } from "react-icons/vsc";
import { createPlaylist } from "~/apis";
import { toast } from "react-toastify";
import { fetchLibraryDetailsAPI } from "~/redux/slice/userLibrarySlice";
import { useDispatch } from "react-redux";



const SidebarHeader = ({ onToggle, isExpanded }) => {
  const dispatch = useDispatch();


  const handleCreatePlaylist = () => {
    createPlaylist()
      .then((response) => {
        const newPlaylist = response.data;
        // Dispatch an action to fetch the updated library details
        dispatch(fetchLibraryDetailsAPI());
        toast.success("Tạo danh sách phát thành công!");
        console.log("New playlist created:", newPlaylist);
      })
      .catch((error) => {
        console.error("Error creating playlist:", error);
        toast.error("Tạo danh sách phát thất bại!");
      });
    
  }
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2 hover:cursor-pointer hover:text-gray-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition duration-300">
        <VscLibrary className="text-2xl" />
        <h1 className="text-lg font-semibold">Thư viện</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-gray-700 text-white transition hover:cursor-pointer"
        onClick={handleCreatePlaylist}
        >
          <Plus size={16} />
          <span className="text-sm font-semibold">Tạo</span>
        </button>
        {/* <button
          onClick={onToggle}
          className="p-2 rounded-full hover:bg-gray-700 transition-transform duration-200"
        >
          <ArrowRight
            size={20}
            className={`${
              isExpanded ? "rotate-180" : ""
            } transition-transform duration-300`}
          />
        </button> */}
      </div>
    </div>
  );
};

export default SidebarHeader;
