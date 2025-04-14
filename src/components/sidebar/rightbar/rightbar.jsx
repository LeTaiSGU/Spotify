import React from "react";
import Video from "./video";
import Header from "./header";
import { PlusCircle } from "lucide-react";
import MarqueeSpan from "./marqueSpan.jsx";
import { useSelector } from "react-redux";

const BoxArtist = ({ artist, isMainArtist }) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-xl p-2 text-white">
      <div className="flex flex-col">
        <h2 className="text-base font-semibold">{artist.name}</h2>
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
        key="artist1"
        artist={{ name: song.artist1 }}
        isMainArtist={true}
      />

      {/* Hiển thị danh sách nghệ sĩ từ artist2 */}
      {song.artist2.map((artist, index) => (
        <BoxArtist key={index} artist={{ name: artist }} isMainArtist={false} />
      ))}
    </div>
  );
};

const Rightbar = () => {
  const song = useSelector((state) => state.song.song);

  return (
    <div className="h-full flex flex-col mx-3 bg-[#121212] rounded-xl text-white w-[20%] overflow-auto custom-scrollbar">
      <Header />
      <Video />
      <div className="flex flex-row justify-between px-4">
        <div className="flex flex-col">
          <MarqueeSpan>{song.title}</MarqueeSpan>
          <div className="relative group">
            {" "}
            {/* Thêm class group cho chứa tooltip */}
            <h2 className="text-base font-semibold overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
              {song.artist1}
              {song.artist2.length > 0 && `, ${song.artist2.join(", ")}`}
            </h2>
            {/* Tooltip khi hover vào */}
            <span className="absolute left-0 top-full hidden group-hover:block bg-black text-white text-xs p-2 rounded-md mt-1 w-max max-w-[300px]">
              {song.artist1}
              {song.artist2.length > 0 && `, ${song.artist2.join(", ")}`}
            </span>
          </div>
        </div>
        <PlusCircle className="my-4" />
      </div>

      <ArtistSection song={song} />
    </div>
  );
};

export default Rightbar;
