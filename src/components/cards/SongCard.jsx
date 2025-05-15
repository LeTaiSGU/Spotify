import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  clearQueue,
  addToQueue,
  setSelectedSong,
  toggleRightbar,
  togglePlay,
} from "../../redux/slice/songSlice";
import { API_ROOT } from "~/utils/constants";

const SongCard = ({ song }) => {
  // Lấy dữ liệu artist
  const [mainArtistInfo, setMainArtistInfo] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMainArtist = async () => {
      if (song?.artist_owner) {
        try {
          const response = await fetch(
            `${API_ROOT}/api/artists/${song.artist_owner}`
          );
          const data = await response.json();
          setMainArtistInfo(data);
        } catch (error) {
          console.error("Error fetching main artist:", error);
        }
      }
    };

    fetchMainArtist();
  }, [song?.artist_owner]);

  // Xử lý khi nhấn nút play
  const handlePlay = (e) => {
    e.stopPropagation();
    console.log("Play button clicked for song:", song);
    // Xóa queue cũ
    dispatch(clearQueue());
    // Thêm bài hát mới vào queue
    dispatch(
      addToQueue({
        ...song,
        file_upload: song.file_upload,
      })
    );
    // Set bài hát được chọn và hiện rightbar
    dispatch(setSelectedSong(song));
    dispatch(toggleRightbar(true));
    dispatch(togglePlay(true));
  };

  const handleCardClick = () => {
    console.log("Card clicked:", song);
    dispatch(setSelectedSong(song));
  };

  return (
    <div
      className="w-[200px] bg-[#121212] rounded-lg shadow-sm flex-shrink-0 p-2 relative group hover:bg-[#1f1f1f]"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={song.img || "https://via.placeholder.com/150"}
          alt={song.song_name}
          className="w-[180px] h-[180px] object-cover rounded-md"
        />
        <button
          onClick={handlePlay}
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
        {song.song_name}
      </h3>
      <p className="mt-1 text-xs font-normal text-gray-400 truncate">
        {song.artist_owner ? song.artist_owner.name : "Unknown Artist"}
      </p>
    </div>
  );
};

export default SongCard;
