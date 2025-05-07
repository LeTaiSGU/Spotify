import { Clock, Play } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  getSongBylistId, getSongsByAlbumId, getSongById, getPlaylistsById,
  addSongToPlaylist, removeSongFromPlaylist
} from "~/apis";
import { useParams } from "react-router-dom";
import { Avatar, Popover } from 'antd';
import { PlusCircleOutlined, CheckCircleFilled, EllipsisOutlined } from '@ant-design/icons';

import {
  setSelectedSong,
  toggleRightbar,
  togglePlay,
} from "../../redux/slice/songSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddToPlaylistModal from "~/components/Modal/AddToPlaylistModal";



const Playlist = ({ type }) => {
  const { id } = useParams()
  // const [playlist, setPlaylist] = useState(null);
  const [liked, setLiked] = useState(false);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedSong = useSelector((state) => state.songs.selectedSong);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]); // Danh sách playlist


  const handleOpenModal = async () => {
    try {
      console.log("Song ID:");
      const response = await getPlaylistsById();
      setPlaylists(response);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách playlist:", error);
    }
  };

  const handleAddSongToPlaylist = async (playlistId, songId) => {
    try {
      // Gọi API để thêm bài hát vào playlist
      console.log("Thêm bài hát vào playlist:", playlistId, songId);
      await addSongToPlaylist(playlistId, songId);

      // Đóng modal
      setIsModalVisible(false);

      alert("Thêm bài hát vào danh sách phát thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm bài hát vào danh sách phát:", error);
      alert("Thêm bài hát thất bại!");
    }
  };


  const fetchSongs = async () => {
    try {
      setLoading(true);
      let result = [];

      if (type === "playlist") {
        result = await getSongBylistId(id);
      } else if (type === "album") {
        result = await getSongsByAlbumId(id);
      } else if (type === "song") {
        const song = await getSongById(id);
        result = [song]; 
      }

      setSongs(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài hát:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [type, id]);

  const handlePlay = (song) => {
    dispatch(setSelectedSong(song));
    dispatch(togglePlay(true));
    dispatch(toggleRightbar(true));
  }


  const handleRemoveSongToPlaylist = async (playlistId, songId) => {
    try {
      console.log("Xóa bài hát khỏi playlist:", playlistId, songId);
      await removeSongFromPlaylist(playlistId, songId);
      alert("Xóa bài hát khỏi danh sách phát thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa bài hát khỏi danh sách phát:", error);
      alert("Xóa bài hát thất bại!");
    }
  };



  const renderContent = (songId) => (
    <div className="w-64 bg-gray-800 text-white rounded-lg shadow-lg p-2">
      <ul className="space-y-2">
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded"
          onClick={() => handleOpenModal(songId)} // Truyền songId vào hàm
        >
          Thêm vào danh sách phát
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2 rounded"
          onClick={() => setLiked(!liked)}
        >
          {liked && <FaCheckCircle className="text-green-500" />}
          {liked ? "Xóa khỏi Bài hát yêu thích" : "Thêm vào Bài hát yêu thích"}
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Thêm vào danh sách chờ</li>
        {type === "playlist" && <li
          onClick={() => handleRemoveSongToPlaylist(id, songId)} // Truyền songId vào hàm
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">
          Xóa khỏi Playlist</li>}
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Chuyển tới nghệ sĩ</li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Chuyển đến album</li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Xem thông tin</li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">Chia sẻ</li>
      </ul>
      <AddToPlaylistModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        playlists={playlists}
        onAddSong={(playlistId) => handleAddSongToPlaylist(playlistId, songId)}
      />
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
        {loading ? (
          <tr>
            <td colSpan="4" className="text-center py-5 text-gray-400">
              Đang tải bài hát...
            </td>
          </tr>
        ) : (
          songs?.map((song, index) => (
            <tr
              key={song.id}
              className="group hover:bg-gradient-to-r hover:from-[#2d2a31] hover:to-transparent cursor-pointer text-gray-300 text-sm font-normal border-b border-gray-700 transition"
              onDoubleClick={() => handlePlay(song)}
            >
              <td className="py-3 w-10 text-center" onClick={() => handlePlay(song)}>
                <div className="flex items-center justify-center">
                  {selectedSong?.id === song.id ? (
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
                      className={`font-semibold truncate block ${selectedSong?.id === song.id
                        ? "text-[#1ed760] hover:underline"
                        : "group-hover:text-white hover:underline"
                        }`}
                      title={song.title} // Hiển thị tooltip khi hover
                      onClick={() => { navigate(`/song/${song.id}`) }}
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
                {song.album.title}
              </td>
              {/* <td className="py-3 w-[20%] truncate">{song.dateAdded}</td> */}
              <td className="py-3 w-[15%] text-center relative">
                {song.duration}
                {/* Biểu tượng ba chấm khi hover */}
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                  <Popover placement='bottom' content={renderContent(song.id)} trigger="click">
                    <EllipsisOutlined className="text-white text-xl cursor-pointer hover:text-gray-400" />
                  </Popover>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Playlist;
