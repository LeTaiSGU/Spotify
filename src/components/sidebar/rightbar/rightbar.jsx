import React, { useEffect, useState } from "react";
import Video from "./video";
import Header from "./header";
import { PlusCircle } from "lucide-react";
import MarqueeSpan from "./marqueSpan.jsx";
import { useSelector } from "react-redux";

const BoxArtist = ({ artistId, isMainArtist }) => {
  const [artistInfo, setArtistInfo] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/artists/${artistId}`
        );
        const data = await response.json();
        setArtistInfo(data);
      } catch (error) {
        console.error("Error fetching artist:", error);
      }
    };

    if (artistId) {
      fetchArtist();
    }
  }, [artistId]);

  if (!artistInfo) return null;
  return (
    <div className="flex flex-row items-center justify-between rounded-xl p-2 text-white">
      <div className="flex flex-col">
        <h2 className="text-base font-semibold">{artistInfo.name}</h2>
        <span className="text-sm text-[#bbbbbb] font-semibold">
          {isMainArtist ? "Nghệ sĩ chính" : "Nghệ sĩ phụ"}
        </span>
      </div>
      <button className="text-sm text-white border border-gray-500 rounded-full px-3 py-1 hover:bg-gray-700">
        Theo dõi
      </button>
    </div>
  );
};

const ArtistSection = ({ song }) => {
  if (!song) return null;

  return (
    <div className="flex flex-col gap-4 m-2 px-4 bg-[#1f1f1f] rounded-xl p-4 mb-4 text-white">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-base font-semibold">Người tham gia thực hiện</h2>
        <button className="text-sm text-[#bbbbbb] font-semibold px-3 py-1 hover:underline hover:text-white">
          Hiện tất cả
        </button>
      </div>

      {/* Hiển thị nghệ sĩ chính */}
      <BoxArtist
        key="artist-main"
        artistId={song.artist_owner}
        isMainArtist={true}
      />

      {/* Hiển thị danh sách nghệ sĩ phụ */}
      {Array.isArray(song.artists) &&
        song.artists.map((artistId, index) => (
          <BoxArtist
            key={`artist-${artistId}-${index}`}
            artistId={artistId}
            isMainArtist={false}
          />
        ))}
    </div>
  );
};

const Rightbar = () => {
  const selectedSong = useSelector((state) => state.songs.selectedSong);
  const [mainArtistInfo, setMainArtistInfo] = useState(null);

  useEffect(() => {
    const fetchMainArtist = async () => {
      if (selectedSong?.artist_owner) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/artists/${selectedSong.artist_owner}`
          );
          const data = await response.json();
          setMainArtistInfo(data);
        } catch (error) {
          console.error("Error fetching main artist:", error);
        }
      }
    };

    fetchMainArtist();
  }, [selectedSong?.artist_owner]);
  return (
    <div className="h-full flex flex-col ml-3 bg-stone-900 rounded-xl text-white w-[20%] overflow-auto">
      <Header />
      {/* <Video /> */}
      <div className="w-full px-4 mb-10 ">
        <img
          src={selectedSong?.img}
          alt={selectedSong?.song_name}
          className="w-full aspect-square object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-row justify-between px-4">
        <div className="flex flex-col">
          <MarqueeSpan>{selectedSong.song_name}</MarqueeSpan>
          <h2>{mainArtistInfo?.name || "Loading..."}</h2>
        </div>
        <PlusCircle className="my-4" />
      </div>

      <ArtistSection song={selectedSong} />
    </div>
  );
};

export default Rightbar;
