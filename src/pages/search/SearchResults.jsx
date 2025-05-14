import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { searchContent } from "../../redux/slice/searchSlice";
import {
  clearQueue,
  addToQueue,
  setSelectedSong,
  toggleRightbar,
  togglePlay,
} from "../../redux/slice/songSlice";
import "../../style/search.css";
import { toast } from "react-toastify";
import {
  createNewPlaylist,
  addSongToPlaylist as addSongToPlaylistAction,
} from "../../redux/slice/playlistSlice";
import { getPlaylistsById } from "~/apis";
import { fetchLibraryDetailsAPI } from "~/redux/slice/userLibrarySlice";

// Component SongRow mới để thay thế SongCard

export const SongRow = ({ song }) => {
  const [mainArtistInfo, setMainArtistInfo] = React.useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = React.useState(false);
  const [playlists, setPlaylists] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  // const user = useSelector((state) => state.auth?.user || { id: 1 });

  React.useEffect(() => {
    const fetchMainArtist = async () => {
      if (song?.artist_owner) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/artists/${song.artist_owner}`
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

  // Close modal khi click ra ngoài
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowPlaylistModal(false);
      }
    };

    if (showPlaylistModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPlaylistModal]);

  // Fetch playlists của user
  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const data = await getPlaylistsById();
      console.log("User playlists:", data);
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    console.log("Play button clicked for song:", song);
    dispatch(clearQueue());
    dispatch(
      addToQueue({
        ...song,
        file_upload: song.file_upload,
      })
    );
    dispatch(setSelectedSong(song));
    dispatch(toggleRightbar(true));
    dispatch(togglePlay(true));
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    fetchPlaylists();
    setShowPlaylistModal(true);
  };

  // Cập nhật hàm addSongToPlaylist để trả về Promise

  const addSongToPlaylist = async (playlistId) => {
    try {
      console.log(`Đang thêm bài hát ${song.id} vào playlist ${playlistId}`);

      const response = await fetch(
        `http://localhost:8000/api/playlist_songs/${playlistId}/add/${song.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);

      if (response.ok) {
        toast.success(`Đã thêm bài hát "${song.song_name}" vào playlist!`);
        setShowPlaylistModal(false);
        return true; // Trả về true để .then() hoạt động
      } else {
        // Xử lý lỗi như bình thường
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          toast.error(
            `Lỗi: ${errorData.detail || "Không thể thêm bài hát vào playlist"}`
          );
        } else {
          toast.error(`Lỗi: ${response.status} ${response.statusText}`);
        }
        return false;
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      toast.error("Đã xảy ra lỗi khi thêm bài hát vào playlist");
      return false;
    }
  };

  // Hàm tạo playlist mới - sử dụng Redux thunk
  const handleCreatePlaylist = () => {
    // Chuẩn bị dữ liệu cho playlist mới
    const playlistData = {
      title: `Playlist mới ${new Date().toLocaleDateString()}`,
      description: "",
      isPublic: true,
    };

    dispatch(createNewPlaylist(playlistData))
      .unwrap()
      .then((newPlaylist) => {
        toast.success("Tạo danh sách phát thành công!");

        // Thêm bài hát vào playlist vừa tạo
        if (newPlaylist && newPlaylist.id) {
          // Thêm bài hát vào playlist mới
          addSongToPlaylist(newPlaylist.id).then(() => {
            // Sau khi thêm bài hát thành công, cập nhật lại danh sách playlist
            fetchPlaylists();
            dispatch(fetchLibraryDetailsAPI());
          });
        } else {
          // Nếu không có id playlist, vẫn cập nhật danh sách
          fetchPlaylists();
        }
      })
      .catch((error) => {
        console.error("Error creating playlist:", error);
        toast.error("Tạo danh sách phát thất bại!");
      });
  };

  // Format thời gian từ giây sang MM:SS
  const formatTime = (duration) => {
    // Nếu không có giá trị duration
    if (!duration) return "2:54";

    try {
      // Kiểm tra nếu duration là chuỗi ISO 8601 như "PT3M45S"
      if (typeof duration === "string") {
        if (duration.includes("PT")) {
          // Trích xuất phút và giây từ chuỗi ISO
          const minutes = duration.match(/(\d+)M/);
          const seconds = duration.match(/(\d+)S/);

          const mins = minutes ? parseInt(minutes[1]) : 0;
          const secs = seconds ? parseInt(seconds[1]) : 0;

          return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
        }

        // Kiểm tra nếu duration là chuỗi "HH:MM:SS"
        if (duration.includes(":")) {
          const parts = duration.split(":");
          if (parts.length >= 2) {
            const mins = parseInt(parts[parts.length - 2]);
            const secs = parseInt(parts[parts.length - 1]);
            return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
          }
        }
      }

      // Nếu duration là số (giây)
      if (typeof duration === "number") {
        const mins = Math.floor(duration / 60);
        const secs = Math.floor(duration % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      }

      // Log để debug
      console.log("Unknown duration format:", duration, typeof duration);

      // Trả về giá trị mặc định nếu không xử lý được
      return "2:54";
    } catch (error) {
      console.error("Error formatting duration:", error, duration);
      return "2:54";
    }
  };

  return (
    <div className="group px-4 py-2 hover:bg-[#282828] rounded-lg transition-all duration-200 relative">
      <div className="flex items-center">
        {/* Hình ảnh và nút play */}
        <div className="relative min-w-[64px] min-h-[64px] mr-4">
          <img
            src={song.img || "https://via.placeholder.com/80"}
            alt={song.song_name}
            className="w-[64px] h-[64px] object-cover rounded-md"
          />

          {/* Chỉ giữ nút play ở đây */}
          <button
            onClick={handlePlay}
            className="absolute bottom-1 right-1 bg-[#1ed760] text-black rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
            title="Phát"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        {/* Thông tin bài hát */}
        <div className="flex flex-1 justify-between items-center">
          <div className="flex flex-col">
            <h3 className="text-white font-medium text-base">
              {song.song_name}
            </h3>
            <p className="text-gray-400 text-sm">
              {song.artist_owner ? song.artist_owner.name : "Unknown Artist"}
            </p>
          </div>

          {/* Controls và thời lượng */}
          <div className="flex items-center gap-2">
            {/* Nút thêm vào playlist - đã được chuyển đến đây */}
            <button
              onClick={handleAddToPlaylist}
              className="bg-transparent hover:bg-gray-700 text-gray-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Thêm vào playlist"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>

            {/* Thời lượng */}
            <div className="text-gray-400 text-sm">
              {formatTime(song.duration)}
            </div>
          </div>
        </div>
      </div>

      {/* Modal danh sách playlist */}
      {showPlaylistModal && (
        <div
          className="absolute left-16 top-full mt-2 z-50 w-64 bg-[#282828] rounded-md shadow-lg overflow-hidden"
          ref={modalRef}
        >
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-white font-medium">Danh sách playlist</h3>
          </div>

          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : playlists.length > 0 ? (
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              <ul className="py-1">
                {playlists.map((playlist) => (
                  <li
                    key={playlist.id}
                    className="px-4 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center"
                    onClick={() => addSongToPlaylist(playlist.id)}
                  >
                    <div className="w-10 h-10 mr-3">
                      <img
                        src={
                          playlist.cover_image ||
                          "https://via.placeholder.com/40"
                        }
                        alt={playlist.name || playlist.title}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                    <span className="text-white text-sm truncate">
                      {playlist.name || playlist.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              Không có playlist nào
            </div>
          )}

          <div className="p-2 border-t border-gray-700">
            <button
              className="w-full py-2 bg-[#1DB954] text-black font-medium rounded-full hover:bg-[#1ed760] transition"
              onClick={handleCreatePlaylist}
            >
              Tạo playlist mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AlbumCard = ({ album }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/album/${album.id}`);
  };

  return (
    <div
      className="w-[200px] bg-[#121212] rounded-lg shadow-sm flex-shrink-0 p-2 relative group hover:bg-[#1f1f1f] cursor-pointer"
      onClick={handleClick}
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
            handleClick();
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
      <p className="mt-1 text-xs font-normal text-gray-400 truncate">Album</p>
    </div>
  );
};

const ArtistCard = ({ artist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artist/${artist.id}`);
  };

  return (
    <div
      className="w-[200px] bg-[#121212] rounded-lg shadow-sm flex-shrink-0 p-2 relative group hover:bg-[#1f1f1f] cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={artist.avatar || "https://via.placeholder.com/150"}
          alt={artist.name}
          className="w-[180px] h-[180px] object-cover rounded-md rounded-full"
        />
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

const SearchResults = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get("q");

  const { results, loading, error } = useSelector((state) => state.search);

  const songsRef = useRef(null);
  const albumsRef = useRef(null);
  const artistsRef = useRef(null);

  useEffect(() => {
    console.log("SearchResults component rendered with query:", queryParam);
    if (queryParam) {
      dispatch(searchContent(queryParam));
    }
  }, [queryParam, dispatch]);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      const newScrollPosition =
        direction === "left"
          ? ref.current.scrollLeft - scrollAmount
          : ref.current.scrollLeft + scrollAmount;

      ref.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Đã xảy ra lỗi</h2>
        <p>{error}</p>
        <button
          className="mt-4 bg-[#1DB954] text-black font-bold py-2 px-4 rounded-full"
          onClick={() => dispatch(searchContent(queryParam))}
        >
          Thử lại
        </button>
      </div>
    );
  }

  const hasSongs = results?.songs?.length > 0;
  const hasAlbums = results?.albums?.length > 0;
  const hasArtists = results?.artists?.length > 0;

  if (!hasSongs && !hasAlbums && !hasArtists && queryParam) {
    return (
      <div className="w-full p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Không tìm thấy kết quả cho "{queryParam}"
        </h2>
        <p className="text-gray-400">
          Hãy thử tìm kiếm một từ khóa khác hoặc kiểm tra chính tả.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-stone-900 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Kết quả tìm kiếm cho "{queryParam}"
      </h1>

      {/* Phần Bài Hát */}
      {hasSongs && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Bài hát</h2>
          <div className="bg-[#121212] rounded-md">
            {results.songs.map((song) => (
              <SongRow key={song.id || song.songId} song={song} />
            ))}
          </div>
        </div>
      )}

      {/* Phần Albums */}
      {hasAlbums && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Albums</h2>
          <div className="relative">
            <button
              onClick={() => scroll(albumsRef, "left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full z-10"
            >
              <LeftOutlined />
            </button>

            <div
              ref={albumsRef}
              className="w-full flex gap-4 overflow-x-auto hidden-scrollbar scroll-smooth px-10"
            >
              {results.albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>

            <button
              onClick={() => scroll(albumsRef, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full z-10"
            >
              <RightOutlined />
            </button>
          </div>
        </div>
      )}

      {/* Phần Nghệ Sĩ */}
      {hasArtists && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Nghệ sĩ</h2>
          <div className="relative">
            <button
              onClick={() => scroll(artistsRef, "left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full z-10"
            >
              <LeftOutlined />
            </button>

            <div
              ref={artistsRef}
              className="w-full flex gap-4 overflow-x-auto hidden-scrollbar scroll-smooth px-10"
            >
              {results.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>

            <button
              onClick={() => scroll(artistsRef, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full z-10"
            >
              <RightOutlined />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
