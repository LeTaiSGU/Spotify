import { Clock, Play } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getSongBylistId } from "~/apis";
import { useParams } from "react-router-dom";
import { Avatar, Popover } from 'antd';
import { PlusCircleOutlined, CheckCircleFilled, EllipsisOutlined } from '@ant-design/icons';


const Playlist = () => {
  const [playingSongId, setPlayingSongId] = useState(1);
  const { playlistId } = useParams()
  const [playlist, setPlaylist] = useState(null);
  const [liked, setLiked] = useState(false);



  const fetchPlaylist = async () => {
    try {
      const data = await getSongBylistId(playlistId);
      setPlaylist(data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

    const content = (
      <div className="w-64 bg-gray-800 text-white rounded-lg shadow-lg p-2">
        <ul className="space-y-2">
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Thêm vào danh sách phát</li>
          <li
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2 rounded"
            onClick={() => setLiked(!liked)}
          >
            {liked && <FaCheckCircle className="text-green-500" />} 
            {liked ? "Xóa khỏi Bài hát yêu thích" : "Thêm vào Bài hát yêu thích"}
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Thêm vào danh sách chờ</li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Bắt đầu một Jam</li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Chuyển tới nghệ sĩ</li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Chuyển đến album</li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Xem thông tin</li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Chia sẻ</li>
        </ul>
      </div>
    );

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
          {/* <th className="py-3 w-[20%]">Ngày thêm</th> */}
          <th className="py-3 w-[15%] text-center">
            <Clock className="w-4 h-4 inline-block" />
          </th>
        </tr>
      </thead>
      <tbody>
        {playlist?.map((song, index) => (
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
                  src={song.img}
                  alt={song.song_name}
                  className="w-10 h-10 object-cover rounded-md"
                />
                <div>
                  <h1
                    className={`font-semibold truncate ${
                      playingSongId === song.id
                        ? "text-[#1ed760] hover:underline"
                        : "group-hover:text-white hover:underline"
                    }`}
                  >
                    {song.song_name}
                  </h1>
                  <p className="text-[#9a9a9b] text-sm truncate hover:underline hover:text-white">
                    {song.artist1}
                  </p>
                </div>
              </div>
            </td>
            <td className="py-3 w-[25%] truncate hover:underline hover:text-white">
              {song.album}
            </td>
            {/* <td className="py-3 w-[20%] truncate">{song.dateAdded}</td> */}
            <td className="py-3 w-[15%] text-center relative">
              {song.duration}
              {/* Biểu tượng ba chấm khi hover */}
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                <Popover placement='bottom' content={content} trigger="click">
                  <EllipsisOutlined className="text-white text-xl cursor-pointer hover:text-gray-400" />
                </Popover>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Playlist;
