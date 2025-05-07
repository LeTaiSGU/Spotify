import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ProfileHeader from "./ProfileHeader";
import { SongRow } from "../search/SearchResults"; // Import SongRow từ SearchResults
import AlbumList from "./AlbumList"; // Sẽ tạo component này sau

function ArtistProfile() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch thông tin nghệ sĩ
    const fetchArtistData = async () => {
      try {
        setLoading(true);

        // Fetch artist info
        const artistResponse = await fetch(
          `http://localhost:8000/api/artists/${id}`
        );
        if (!artistResponse.ok) throw new Error("Failed to fetch artist");
        const artistData = await artistResponse.json();
        setArtist(artistData);

        // Fetch songs by artist
        const songsResponse = await fetch(
          `http://localhost:8000/api/songs/artist/${id}`
        );
        if (!songsResponse.ok) throw new Error("Failed to fetch songs");
        const songsData = await songsResponse.json();
        setSongs(songsData);

        // Fetch albums by artist
        const albumsResponse = await fetch(
          `http://localhost:8000/api/albums/artist/${id}`
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
          <h2 className="text-2xl font-bold mb-4 text-white">
            Bài hát phổ biến
          </h2>
          <div className="bg-[#121212] rounded-md">
            {songs.length > 0 ? (
              songs.map((song) => <SongRow key={song.id} song={song} />)
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
