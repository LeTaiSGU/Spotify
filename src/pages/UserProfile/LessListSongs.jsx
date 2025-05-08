import { Avatar, Popover, Modal } from "antd";
import {
  PlusCircleOutlined,
  CheckCircleFilled,
  EllipsisOutlined,
} from "@ant-design/icons";
import { FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getSongHistory,
  getPlaylistsById,
  addSongToPlaylist,
} from "../../apis";
import {
  clearQueue,
  addToQueue,
  setSelectedSong,
  toggleRightbar,
  togglePlay,
} from "../../redux/slice/songSlice";
import { toast } from "react-toastify";

function LessListSongs() {
  const [liked, setLiked] = useState(false);
  const [mockSongs, setMockSongs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user.id);
  const dispatch = useDispatch();

  const handleOpenModal = async (songId) => {
    try {
      const response = await getPlaylistsById();
      setPlaylists(response);
      setSelectedSongId(songId);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách playlist:", error);
      toast.error("Không thể lấy danh sách playlist!");
    }
  };

  const handleAddSongToPlaylist = async (playlistId, songId) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      setIsModalVisible(false);
      toast.success("Đã thêm bài hát vào playlist!");
    } catch (error) {
      console.error("Lỗi khi thêm bài hát vào playlist:", error);
      toast.error("Bài hát đã có trong playlist!");
    }
  };

  const handleSongClick = (song) => {
    dispatch(clearQueue());
    // Thêm bài hát mới vào queue
    dispatch(
      addToQueue({
        ...song,
        file_upload: song.file_upload,
      })
    );
    // Set bài hát được chọn và hiện rightbar
    dispatch(setSelectedSong(song));
    dispatch(toggleRightbar(true));
    dispatch(togglePlay(true));
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getSongHistory(userId);
        setMockSongs(data || []);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setMockSongs([]);
      }
    };
    fetchSongs();
  }, [userId]);

  const renderContent = (songId) => (
    <div className="w-64 bg-gray-800 text-white rounded-lg shadow-lg p-2">
      <ul className="space-y-2">
        <li
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded"
          onClick={() => handleOpenModal(songId)}
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
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">
          Thêm vào danh sách chờ
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">
          Bắt đầu một Jam
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">
          Chuyển tới nghệ sĩ
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">
          Chuyển đến album
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">
          Xem thông tin
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded">
          Chia sẻ
        </li>
      </ul>
    </div>
  );

  return (
    <div className="bg-stone-900">
      <div className="p-6 text-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-white">Top List Songs</h1>
          <span
            className="text-lg text-gray-400 cursor-pointer hover:text-white"
            onClick={() => {
              navigate("/user/more-songs");
            }}
          >
            Xem tất cả
          </span>
        </div>

        <table className="table-auto w-full shadow-lg rounded-lg overflow-hidden">
          <tbody>
            {mockSongs.slice(0, 4).map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-700 transition duration-300 cursor-pointer"
                onDoubleClick={() => handleSongClick(item)}
              >
                {/* Song Info */}
                <td className="py-3 px-4 flex items-center gap-3">
                  <Avatar src={item.img} className="w-12 h-12 rounded-lg" />
                  <div className="flex flex-col">
                    <span className="text-white font-medium">
                      {item.song_name}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {item.artist_owner.name}
                    </span>
                  </div>
                </td>

                <td className="text-gray-300 hidden md:table-cell">
                  {item?.album?.title || "Unknown Album"}
                </td>

                <td className="text-gray-300 text-center">{item.duration}</td>

                <td className="text-center">
                  <Popover
                    placement="bottom"
                    content={() => renderContent(item.id)}
                    trigger="click"
                  >
                    <EllipsisOutlined className="text-white text-xl cursor-pointer hover:text-gray-400" />
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Chọn playlist"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="max-h-96 overflow-y-auto">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center p-4 hover:bg-gray-700 cursor-pointer rounded-lg mb-2 bg-gray-800"
              onClick={() =>
                handleAddSongToPlaylist(playlist.id, selectedSongId)
              }
            >
              <img
                src={playlist.cover_image || "https://via.placeholder.com/40"}
                alt={playlist.name}
                className="w-10 h-10 rounded-lg mr-3 object-cover"
              />
              <div>
                <div className="font-medium text-white">{playlist.name}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default LessListSongs;
