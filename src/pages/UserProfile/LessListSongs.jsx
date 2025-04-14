import { Avatar, Popover } from 'antd';
import { PlusCircleOutlined, CheckCircleFilled, EllipsisOutlined } from '@ant-design/icons';
import { FaCheckCircle } from "react-icons/fa";
import { useState } from 'react';

// Mock dữ liệu bài hát
const mockSongs = [
  {
    songName: "Blinding Lights",
    coverImage: "https://i.scdn.co/image/ab67616d00001e02dfe5e6ff8323cbb520c00660",
    artist: "The Weeknd",
    albumName: "After Hours",
    duration: "3:20",
    streamCount: 2403560000,
  },
  {
    songName: "Shape of You",
    coverImage: "https://i.scdn.co/image/ab67616d00001e0264f9dcf1a3dd0a9d444b039b",
    artist: "Ed Sheeran",
    albumName: "÷ (Divide)",
    duration: "3:53",
    streamCount: 3304520000,
  },
  {
    songName: "Levitating",
    coverImage: "https://i.scdn.co/image/ab67616d00001e02d3cfecb6321cfdf4943a70c1",
    artist: "Dua Lipa",
    albumName: "Future Nostalgia",
    duration: "3:23",
    streamCount: 1708250000,
  },
  {
    songName: "Bad Guy",
    coverImage: "https://i.scdn.co/image/ab67616d00001e02b2c8439b35e0083f7ab0581e",
    artist: "Billie Eilish",
    albumName: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?",
    duration: "3:14",
    streamCount: 2509150000,
  }
];

function LessListSongs() {
  const [liked, setLiked] = useState(false);

  const content = (
    <div className="w-64 bg-zinc-900 text-white rounded-lg shadow-lg p-2">
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
    <div className='bg-zinc-950'>
    <div className="p-6 text-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold text-white">Top List Songs</h1>
        <span className="text-lg text-gray-400 cursor-pointer hover:text-white">Xem tất cả</span>
      </div>

      <table className="table-auto w-full shadow-lg rounded-lg overflow-hidden">
        <tbody>
          {mockSongs.map((song, index) => (
            <tr
              key={index}
              className="hover:bg-gray-700 transition duration-300"
            >
              {/* Song Info */}
              <td className="py-3 px-4 flex items-center gap-3">
                <Avatar src={song.coverImage} className="w-12 h-12 rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-white font-medium">{song.songName}</span>
                  <span className="text-gray-400 text-sm">{song.artist}</span>
                </div>
              </td>

              <td className="text-gray-300 hidden md:table-cell">{song.albumName}</td>

              <td className="text-center">
                <PlusCircleOutlined className="text-green-400 text-xl cursor-pointer hover:text-green-500" />
              </td>

              {/* <td className="text-center text-green-500">
                <CheckCircleFilled className="text-xl cursor-pointer" />
              </td> */}

              <td className="text-gray-300 text-center">{song.duration}</td>

              <td className="text-center">
                <Popover placement='bottom' content={content} trigger="click">
                  <EllipsisOutlined className="text-white text-xl cursor-pointer hover:text-gray-400" />
                </Popover>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default LessListSongs;
