import React from "react";
import { useNavigate } from "react-router-dom";

const ArtistCard = ({ artist }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/artist/${artist.id}`);
  };

  return (
    <div
      className="w-[200px] bg-[#121212] rounded-lg shadow-sm flex-shrink-0 p-2 relative group hover:bg-[#1f1f1f] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={artist.avatar || "https://via.placeholder.com/150"}
          alt={artist.name}
          className="w-[180px] h-[180px] object-cover rounded-full"
        />
        <button
          className="hover:cursor-pointer absolute bottom-2 right-2 bg-[#1ed760] text-black rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/artist/${artist.id}`);
          }}
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
      <h3 className="mt-2 text-sm font-medium text-white leading-tight text-center">
        {artist.name}
      </h3>
      <p className="mt-1 text-xs font-normal text-gray-400 text-center">
        Nghệ sĩ
      </p>
    </div>
  );
};

export default ArtistCard;
