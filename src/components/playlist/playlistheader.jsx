// playlistheader.jsx
import { React, useState, useEffect } from "react";
import avatar from "../../assets/avatar.png";
import { ImagePlus } from "lucide-react";
import EditPlaylistModal from "../sidebar/editPlaylist";
import PlaylistEditModal from "../sidebar/editPlaylist";
import { getPlaylist } from "~/apis";
import { useParams } from "react-router-dom";

// Sửa định nghĩa component Avatar
const Avatar = ({ playlist, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mr-6 relative group" onClick={handleOpenModal}>
        <img
          src={playlist?.cover_image || "https://via.placeholder.com/150"}
          alt="Playlist Cover"
          className="w-48 h-48 object-cover shadow-lg m-5 rounded-sm transition-opacity group-hover:opacity-70"
        />
        <div className="absolute inset-0 m-5 w-48 h-48 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
        <ImagePlus className="absolute top-8 left-8 w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <PlaylistEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={playlist?.name || ""}
        description={playlist?.description || ""}
        cover={playlist?.cover_image || "https://via.placeholder.com/150"}
        playlistId={playlist?.id}
        onSave={onRefresh} // Truyền callback refresh đúng cách
      />
    </>
  );
};

const PlaylistHeader = ({ type }) => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlaylist = async () => {
    try {
      setLoading(true); 
      const data = await getPlaylist(playlistId);
      setPlaylist(data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  // Xác định kích thước chữ dựa trên độ dài tên playlist thực tế
  let titleSizeClass;
  const charCount = playlist?.name?.length || 0;
  
  if (charCount <= 15) {
    titleSizeClass = "text-7xl";
  } else if (charCount <= 35) {
    titleSizeClass = "text-5xl";
  } else {
    titleSizeClass = "text-2xl";
  }

  return (
    <div className="flex flex-row w-full text-white">
      {/* Hiển thị loading state hoặc content dựa vào trạng thái loading */}
      {loading ? (
        <div className="flex items-center justify-center w-full p-10">
          <p className="text-gray-400">Đang tải thông tin playlist...</p>
        </div>
      ) : (
        <>
          {/* Chỉ hiển thị nếu playlist đã được load */}
          {playlist ? (
            <>
              {/* Sửa cách truyền props */}
              <Avatar playlist={playlist} onRefresh={fetchPlaylist} />
              <div className="flex flex-col justify-end my-6">
                <h1 className="text-sm font-semibold my-2">Playlist</h1>
                <h1 className={`font-bold mb-2 ${titleSizeClass}`}>{playlist.name}</h1>

                {playlist.description && (
                  <div className="relative group max-w-lg">
                    <p className="mb-2 text-gray-300 truncate text-xs">{playlist.description}</p>
    
                    <div className="absolute hidden group-hover:block bottom-full mb-2 w-max max-w-md bg-gray-700 text-white text-xs p-2 rounded-lg shadow-lg z-10">
                      {playlist.description}
                    </div>
                  </div>
                )}

                <span className="flex flex-row text-sm font-semibold justify-start items-center">
                  <img
                    src={playlist?.owner?.image || avatar}
                    alt="avatar"
                    className="w-8 h-8 object-cover shadow-lg me-2 rounded-3xl"
                  />
                  <span className="font-bold hover:cursor-pointer hover:underline">
                    {playlist?.owner?.name || "User"}
                  </span>
                  <span className="ms-2 text-gray-300">
                    {playlist?.songs?.length || 0} bài hát, {playlist.duration || "0 phút"}
                  </span>
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full p-10">
              <p className="text-gray-400">Không tìm thấy playlist</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlaylistHeader;