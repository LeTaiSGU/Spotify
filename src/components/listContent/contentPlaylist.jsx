import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  fetchTopSongs,
  clearQueue,
  addToQueue,
  setSelectedSong,
  toggleRightbar,
  togglePlay,
} from "../../redux/slice/songSlice";
import "../../style/contentPlaylist.css";
import PublicPlaylists from "./publicPlaylists";
import { useNavigate } from "react-router-dom";

const CardSong = ({ song }) => {
  const navigate = useNavigate();
  // Lấy dữ liệu song từ Redux store
  const dispatch = useDispatch();

  // Sửa lại hàm xử lý khi nhấn nút play
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

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    navigate(`/song/${song?.id}`);
  };

  return (
    <div
      className="w-[200px] bg-[#121212] rounded-lg shadow-sm flex-shrink-0 p-2 relative group hover:bg-[#1f1f1f]"
      onClick={handleCardClick} // Thêm onClick để xử lý khi click vào card
      onDoubleClick={handleDoubleClick}
    >
      <div className="relative">
        <img
          src={song.img || "https://via.placeholder.com/150"}
          alt={song.song_mame}
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

const MusicSession = () => {
  const dispatch = useDispatch();
  const { songs, loading } = useSelector((state) => state.songs);
  const recommendedRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTopSongs());
  }, [dispatch]);

  // Thêm effect để reset selectedSong khi showPlaylistContent thay đổi

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      const newScrollPosition =
        direction === "left"
          ? ref.current.scrollLeft - scrollAmount
          : ref.current.scrollLeft + scrollAmount;

      // console.log("New scroll position:", newScrollPosition);

      ref.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleSongClick = (song) => {
    // Thêm log để kiểm tra
    console.log("Single song clicked:", song);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full p-5 bg-stone-900 h-full text-white">
        <h2 className="text-xl font-bold mb-3">Gợi ý cho bạn</h2>
        <div className="relative">
          {/* Nút trái */}
          <button
            onClick={() => scroll(recommendedRef, "left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full z-10"
          >
            <LeftOutlined />
          </button>

          <div
            ref={recommendedRef}
            className="w-full flex gap-1 overflow-x-auto hidden-scrollbar scroll-smooth px-12"
          >
            {loading ? (
              <p>Loading...</p>
            ) : (
              songs?.map((song, index) => (
                <CardSong
                  key={song.songId || index}
                  song={song}
                  onSongClick={handleSongClick}
                />
              ))
            )}
          </div>

          {/* Nút phải */}
          <button
            onClick={() => scroll(recommendedRef, "right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full z-10"
          >
            <RightOutlined />
          </button>
        </div>

      </div>
      <PublicPlaylists />

    </div>
  );
};

export default MusicSession;
