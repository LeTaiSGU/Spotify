// SidebarPlaylists.jsx
import { useState, useEffect } from "react";
import React from "react";
import { Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLibraryDetailsAPI, selectUserLibrary } from "~/redux/slice/userLibrarySlice";


const SidebarPlaylists = ({ isExpanded }) => {
  const isplayed = useState(true);
  const dispatch = useDispatch();
  const libraryDetails = useSelector(selectUserLibrary);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchLibraryDetailsAPI());
      } catch (error) {
        console.error("Error fetching library details:", error);
      }
    };

    fetchData();
  }
  , [dispatch]);

  return (
    <div className="flex-1 overflow-y-auto">
      {!isExpanded ? (
        libraryDetails?.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 mx-2 rounded-md hover:bg-gray-700 cursor-pointer"
          >
            <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
              {item.isLiked ? (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Heart className="text-white fill-white" size={24} />
                </div>
              ) : (
                <img
                  src={item?.cover_image || "/placeholder.svg"}
                  alt={item?.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {item.name}
              </span>
              <div className="flex items-center text-xs text-zinc-400">
                <span className="truncate">{item.type}</span>
                <span className="mx-1">•</span>
                <span className="truncate">{item.creator}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          <div className="grid grid-cols-[1fr_120px_100px] gap-2 px-4 py-2 text-sm text-zinc-400">
            <span>Tiêu đề</span>
            <span className="text-right">Đã thêm Ngày</span>
            <span className="text-right">Đã phát</span>
          </div>
          {libraryDetails.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_120px_100px] items-center gap-2 p-2 mx-2 rounded-md hover:bg-gray-700 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                  {item.isLiked ? (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Heart className="text-white fill-white" size={24} />
                    </div>
                  ) : (
                    <img
                      src={item.cover_image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">
                    {item.name}
                  </span>
                  <div className="flex items-center text-xs text-zinc-400">
                    <span className="truncate">{item.type}</span>
                    <span className="mx-1">•</span>
                    <span className="truncate">{item.creator}</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-zinc-400 text-right">
                {item.create_at}
              </span>
              <span className="text-sm text-zinc-400 text-right">
                {item.lastPlayed}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SidebarPlaylists;
