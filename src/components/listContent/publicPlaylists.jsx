import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicPlaylists } from "~/apis"; // API đã có sẵn
import "../../style/contentPlaylist.css";

const PublicPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicPlaylists = async () => {
      try {
        const response = await getPublicPlaylists(); // Gọi API lấy danh sách playlist public
        setPlaylists(response);
      } catch (error) {
        console.error("Lỗi khi fetch danh sách playlist public:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPlaylists();
  }, []);

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`); // Điều hướng đến trang chi tiết playlist
  };

  return (
    <div className="w-full p-5 bg-stone-900 rounded-xl h-full text-white">
      <h2 className="text-xl font-bold mb-3">Public Playlists</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-[#121212] rounded-lg shadow-sm p-3 hover:bg-[#1f1f1f] cursor-pointer"
              onClick={() => handlePlaylistClick(playlist.id)}
            >
              <img
                src={playlist.cover_image || "https://via.placeholder.com/150"}
                alt={playlist.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="mt-2 text-sm font-medium text-white truncate">
                {playlist.name}
              </h3>
              <p className="mt-1 text-xs font-normal text-gray-400 truncate">
                {playlist.description || "Playlist"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicPlaylists;