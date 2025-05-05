// playlistheader.jsx
import { React, useState, useEffect } from "react";
import avatar from "../../assets/avatar.png";
import { ImagePlus } from "lucide-react";
import EditPlaylistModal from "../sidebar/editPlaylist";
import PlaylistEditModal from "../sidebar/editPlaylist";
import { getPlaylist, getAlbumById, getSongById } from "~/apis";
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
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      let result;
      if (type === "playlist") {
        result = await getPlaylist(id); // expected: name, description, cover_image, user, songs
      } else if (type === "album") {
        result = await getAlbumById(id); // expected: title, avatar, description, release_date, artist
      } else if (type === "song") {
        result = await getSongById(id); // expected: song_name, img, description, artist_owner, duration
      }
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type, id]);

  const name =
    type === "playlist" ? data?.name :
    type === "album" ? data?.title :
    type === "song" ? data?.song_name : "";

  const cover =
    type === "playlist" ? data?.cover_image :
    type === "album" ? data?.avatar :
    type === "song" ? data?.img : "";

  const description = data?.description || "";

  const charCount = name?.length || 0;
  const titleSizeClass =
    charCount <= 15 ? "text-7xl" :
    charCount <= 35 ? "text-5xl" : "text-2xl";

  return (
    <div className="flex flex-row w-full text-white">
      {loading ? (
        <div className="flex items-center justify-center w-full p-10">
          <p className="text-gray-400">Đang tải thông tin...</p>
        </div>
      ) : (
        <>
          {data ? (
            <>
              {/* Avatar chỉ có thể chỉnh sửa nếu là playlist */}
              {type === "playlist" ? (
                <Avatar playlist={data} onRefresh={fetchData} />
              ) : (
                <div className="mr-6 relative">
                  <img
                    src={cover || "https://via.placeholder.com/150"}
                    alt="Cover"
                    className="w-48 h-48 object-cover shadow-lg m-5 rounded-sm"
                  />
                </div>
              )}

              <div className="flex flex-col justify-end my-6">
                <h1 className="text-sm font-semibold my-2 capitalize">{type}</h1>
                <h1 className={`font-bold mb-2 ${titleSizeClass}`}>{name}</h1>

                {description && (
                  <div className="relative group max-w-lg">
                    <p className="mb-2 text-gray-300 truncate text-xs">{description}</p>
                    <div className="absolute hidden group-hover:block bottom-full mb-2 w-max max-w-md bg-gray-700 text-white text-xs p-2 rounded-lg shadow-lg z-10">
                      {description}
                    </div>
                  </div>
                )}

                <span className="flex flex-row text-sm font-semibold justify-start items-center">
                  <img
                    src={
                      type === "playlist" ? (data?.owner?.image || avatar) :
                      type === "album" ? (data?.artist?.avatar || avatar) :
                      data?.artist_owner?.avatar || avatar
                    }
                    alt="avatar"
                    className="w-8 h-8 object-cover shadow-lg me-2 rounded-3xl"
                  />
                  <span className="font-bold hover:cursor-pointer hover:underline">
                    {
                      type === "playlist" ? (data?.owner?.name || "User") :
                      type === "album" ? (data?.artist?.name || "Artist") :
                      data?.artist_owner?.name || "Artist"
                    }
                  </span>
                  {type === "playlist" && (
                    <span className="ms-2 text-gray-300">
                      {data?.songs?.length || 0} bài hát, {data.duration || "0 phút"}
                    </span>
                  )}
                  {type === "song" && (
                    <span className="ms-2 text-gray-300">
                      {data?.duration || "0:00"}
                    </span>
                  )}
                  {type === "album" && (
                    <span className="ms-2 text-gray-300">
                      {data?.release_date || ""}
                    </span>
                  )}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full p-10">
              <p className="text-gray-400">Không tìm thấy {type}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlaylistHeader;