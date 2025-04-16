// SidebarPlaylists.jsx
import { useState } from "react";
import React from "react";
import { Heart } from "lucide-react";

const SidebarPlaylists = ({ playlists, isExpanded }) => {
  const isplayed = useState(true);
  return (
    <div className="flex-1 overflow-y-auto">
      {!isExpanded ? (
        playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="flex items-center gap-3 p-2 mx-2 rounded-md hover:bg-gray-700 cursor-pointer"
          >
            <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
              {playlist.isLiked ? (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Heart className="text-white fill-white" size={24} />
                </div>
              ) : (
                <img
                  src={playlist.coverUrl || "/placeholder.svg"}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {playlist.title}
              </span>
              <div className="flex items-center text-xs text-zinc-400">
                <span className="truncate">{playlist.type}</span>
                <span className="mx-1">•</span>
                <span className="truncate">{playlist.creator}</span>
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
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="grid grid-cols-[1fr_120px_100px] items-center gap-2 p-2 mx-2 rounded-md hover:bg-gray-700 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                  {playlist.isLiked ? (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Heart className="text-white fill-white" size={24} />
                    </div>
                  ) : (
                    <img
                      src={playlist.coverUrl || "/placeholder.svg"}
                      alt={playlist.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">
                    {playlist.title}
                  </span>
                  <div className="flex items-center text-xs text-zinc-400">
                    <span className="truncate">{playlist.type}</span>
                    <span className="mx-1">•</span>
                    <span className="truncate">{playlist.creator}</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-zinc-400 text-right">
                {playlist.addedDate}
              </span>
              <span className="text-sm text-zinc-400 text-right">
                {playlist.lastPlayed}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SidebarPlaylists;
