import { Clock, Play } from "lucide-react";
import React, { useState } from "react";

const songs = [
  {
    id: 1,
    title: "Rap God",
    artist: "Eminem",
    album: "The Marshall Mathers LP2 (Deluxe)",
    dateAdded: "28 thg 10, 2021",
    duration: "6:03",
    cover: "https://via.placeholder.com/40",
  },
  {
    id: 2,
    title: "Sài Gòn Có Em (feat. Rap Việt, Blacka)",
    artist: "Rap Việt, Blacka",
    album: "Rap Việt Season 2 - Tập 2",
    dateAdded: "28 thg 10, 2021",
    duration: "2:25",
    cover: "https://via.placeholder.com/40",
  },
  {
    id: 3,
    title: "Alaba Trap",
    artist: "XmaXa, Quang Teo",
    album: "Alaba Trap",
    dateAdded: "28 thg 10, 2021",
    duration: "3:24",
    cover: "https://via.placeholder.com/40",
  },
  {
    id: 4,
    title: "Lối Nhỏ",
    artist: "Đen, Phương Anh Đào",
    album: "Lối Nhỏ",
    dateAdded: "28 thg 10, 2021",
    duration: "4:12",
    cover: "https://via.placeholder.com/40",
  },
  {
    id: 5,
    title: "Đùa Nhau Đi Trốn (Chill Version)",
    artist: "Đen, Linh Cáo",
    album: "Đùa Nhau Đi Trốn (Chill Version)",
    dateAdded: "28 thg 10, 2021",
    duration: "4:01",
    cover: "https://via.placeholder.com/40",
  },
  {
    id: 6,
    title: "Bài Này Chill Phết",
    artist: "Đen",
    album: "Bài Này Chill Phết",
    dateAdded: "28 thg 10, 2021",
    duration: "4:36",
    cover: "https://via.placeholder.com/40",
  },
  {
    id: 7,
    title: "Bài Này Chill Phết",
    artist: "Đen",
    album: "Bài Này Chill Phết",
    dateAdded: "28 thg 10, 2021",
    duration: "4:36",
    cover: "https://via.placeholder.com/40",
  },
];

const Playlist = () => {
  const [playingSongId, setPlayingSongId] = useState(1);

  return (
    <table
      className="w-full text-left table-fixed "
      style={{ borderSpacing: "8px 0" }}
    >
      <thead className="text-gray-400 text-sm font-semibold border-b border-gray-700">
        <tr>
          <th className="py-3 w-10 text-center">#</th>
          <th className="py-3 w-[40%]">Tiêu đề</th>
          <th className="py-3 w-[25%]">Album</th>
          <th className="py-3 w-[20%]">Ngày thêm</th>
          <th className="py-3 w-[15%] text-center">
            <Clock className="w-4 h-4 inline-block" />
          </th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song, index) => (
          <tr
            key={song.id}
            className="group hover:bg-gradient-to-r hover:from-[#2d2a31] hover:to-transparent cursor-pointer text-gray-300 text-sm font-normal border-b border-gray-700 transition"
            onDoubleClick={() => setPlayingSongId(song.id)}
          >
            <td className="py-3 w-10 text-center">
              <div className="flex items-center justify-center">
                {playingSongId === song.id ? (
                  // Nếu bài hát đang phát, hiển thị biểu tượng Play màu xanh
                  <Play className="w-4 h-4 text-[#1ed760]" />
                ) : (
                  // Nếu không phải bài đang phát, hiển thị số thứ tự hoặc biểu tượng Play khi hover
                  <>
                    <span className="group-hover:hidden">{index + 1}</span>
                    <Play className="w-4 h-4 text-gray-500 hidden group-hover:block" />
                  </>
                )}
              </div>
            </td>
            <td className="py-3 w-[40%]">
              <div className="flex items-center gap-2">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-10 h-10 object-cover rounded-md"
                />
                <div>
                  <h1
                    className={`font-semibold truncate block ${
                      playingSongId === song.id
                        ? "text-[#1ed760] hover:underline"
                        : "group-hover:text-white hover:underline"
                    }`}
                    title={song.title} // Hiển thị tooltip khi hover
                  >
                    {song.title}
                  </h1>

                  <p className="text-[#9a9a9b] text-sm truncate hover:underline hover:text-white">
                    {song.artist}
                  </p>
                </div>
              </div>
            </td>
            <td className="py-3 w-[25%] truncate hover:underline hover:text-white">
              {song.album}
            </td>
            <td className="py-3 w-[20%] truncate">{song.dateAdded}</td>
            <td className="py-3 w-[15%] text-center relative">
              {song.duration}
              {/* Biểu tượng ba chấm khi hover */}
              <svg
                className="w-4 h-4 text-gray-400 hidden group-hover:block absolute right-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v.01M12 12v.01M12 18v.01"
                />
              </svg>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Playlist;
