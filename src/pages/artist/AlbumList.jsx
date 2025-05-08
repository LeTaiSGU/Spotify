import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function AlbumList({ albums }) {
  const navigate = useNavigate();
  const albumsRef = useRef(null);

  const scroll = (direction) => {
    if (albumsRef.current) {
      const scrollAmount = 300;
      const newScrollPosition =
        direction === "left"
          ? albumsRef.current.scrollLeft - scrollAmount
          : albumsRef.current.scrollLeft + scrollAmount;

      albumsRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  if (!albums || albums.length === 0) {
    return (
      <div className="text-gray-400 p-4 text-center">Không có album nào</div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full z-10"
      >
        <LeftOutlined />
      </button>

      <div
        ref={albumsRef}
        className="w-full flex gap-4 overflow-x-auto hidden-scrollbar scroll-smooth px-10"
      >
        {albums.map((album) => (
          <div
            key={album.id}
            className="w-[200px] bg-[#121212] rounded-lg shadow-sm flex-shrink-0 p-2 relative group hover:bg-[#1f1f1f] cursor-pointer"
            onClick={() => navigate(`/album/${album.id}`)}
          >
            <div className="relative">
              <img
                src={
                  album.cover_image ||
                  album.avatar ||
                  "https://via.placeholder.com/150"
                }
                alt={album.title}
                className="w-[180px] h-[180px] object-cover rounded-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/album/${album.id}`);
                }}
                className="hover:cursor-pointer absolute bottom-2 right-2 bg-[#1ed760] text-black rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            <h3 className="mt-2 text-sm font-medium text-white leading-tight">
              {album.title}
            </h3>
            <p className="mt-1 text-xs font-normal text-gray-400 truncate">
              Album
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full z-10"
      >
        <RightOutlined />
      </button>
    </div>
  );
}

export default AlbumList;
