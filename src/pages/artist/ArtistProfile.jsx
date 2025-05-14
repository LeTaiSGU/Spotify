import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ProfileHeader from "./ProfileHeader";
import { SongRow } from "../search/SearchResults"; // Import SongRow từ SearchResults
import AlbumList from "./AlbumList"; // Sẽ tạo component này sau
import { API_ROOT } from "~/utils/constants";

function ArtistProfile() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSongs, setExpandedSongs] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch thông tin nghệ sĩ
    const fetchArtistData = async () => {
      try {
        setLoading(true);

        // Fetch artist info
        const artistResponse = await fetch(`${API_ROOT}/api/artists/${id}`);
        if (!artistResponse.ok) throw new Error("Failed to fetch artist");
        const artistData = await artistResponse.json();
        setArtist(artistData);

        // Fetch songs by artist
        const songsResponse = await fetch(`${API_ROOT}/api/songs/artist/${id}`);
        if (!songsResponse.ok) throw new Error("Failed to fetch songs");
        const songsData = await songsResponse.json();
        setSongs(songsData);

        // Fetch albums by artist
        const albumsResponse = await fetch(
          `${API_ROOT}/api/albums/artist/${id}`
        );
        if (!albumsResponse.ok) throw new Error("Failed to fetch albums");
        const albumsData = await albumsResponse.json();
        setAlbums(albumsData);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtistData();
    }
  }, [id]);

  // Hiển thị số bài hát dựa trên trạng thái mở rộng
  const displayedSongs = expandedSongs ? songs.slice(0, 10) : songs.slice(0, 2);

  // Hàm xử lý khi click vào nút xem thêm
  const handleToggleSongs = () => {
    setExpandedSongs(!expandedSongs);
  };

  if (loading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-white p-8 text-center">
        <h2 className="text-2xl font-bold">Không tìm thấy thông tin nghệ sĩ</h2>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header nghệ sĩ */}
      <ProfileHeader artist={artist} />

      {/* Khu vực nội dung chính */}
      <div className="p-6 bg-gradient-to-b from-gray-900 to-stone-900">
        {/* Phần Bài Hát */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Bài hát</h2>
          <div className="bg-[#121212] rounded-md">
            {displayedSongs.length > 0 ? (
              <>
                {displayedSongs.map((song) => (
                  <SongRow key={song.id} song={song} />
                ))}
                {songs.length > 2 && (
                  <div className="py-3 px-4 text-center">
                    <button
                      onClick={handleToggleSongs}
                      className="text-white hover:text-green-500 font-medium"
                    >
                      {expandedSongs ? "Thu gọn" : "Xem thêm"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-400 p-4 text-center">
                Không có bài hát nào
              </div>
            )}
          </div>
        </div>

        {/* Phần Albums */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Albums</h2>
          <AlbumList albums={albums} />
        </div>
      </div>
    </div>
  );
}

export default ArtistProfile;
