import React from "react";
import PlaylistHeader from "./playlistheader";
import { IoPencil } from "react-icons/io5";
import ButtonPlay from "../ui/buttonplay";
import Playlist from "./playlist";
import { MdDownloading } from "react-icons/md";
import { FaMinusCircle } from "react-icons/fa";
import { Popover } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { deletePlaylist, } from "~/apis/index";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchLibraryDetailsAPI } from "~/redux/slice/userLibrarySlice";
import { useDispatch, useSelector } from "react-redux";
import { FaRandom } from "react-icons/fa";

import {
  setSelectedSong,
  toggleRightbar,
  togglePlay,
  clearQueue,
  addToQueue,
} from "../../redux/slice/songSlice";

import { useEffect, useState } from "react";
import { getSongBylistId, getSongsByAlbumId, getSongById } from "~/apis";


function PlaylistContent({ type }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const songQueue = useSelector((state) => state.songs.songQueue);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        let result = [];
        if (type === "playlist") {
          result = await getSongBylistId(id);
        }
        else if (type === "album") {
          result = await getSongsByAlbumId(id);
        }
        else if (type === "song") {
          const song = await getSongById(id);
          result = [song];
        }
        else {
          console.error("Loại không hợp lệ:", type);
          return;
        }
        setSongs(result);
      } catch (error) {
        console.error("Lỗi khi fetch bài hát:", error);
      }
    };

    fetchSongs();
  }, [id, type]);



  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(id);
      toast.success("Xóa playlist thành công")
      await dispatch(fetchLibraryDetailsAPI());
      navigate("/")
    } catch (e) {
      console.error("Xóa playlist thất bại", e)
      toast.error("Xóa playlist thất bại")
    }
  }

  const handlePlaySonglist = () => {
    if (!Array.isArray(songs) || songs.length === 0) {
      console.error("Danh sách bài hát trống hoặc không hợp lệ");
      return;
    }

    // Nạp danh sách bài hát vào queue
    dispatch(clearQueue()); // Xóa queue cũ
    songs.forEach((song) => {
      dispatch(addToQueue(song)); // Thêm từng bài hát vào queue
    });

    // Phát bài hát đầu tiên
    dispatch(setSelectedSong(songs[0]));
    dispatch(togglePlay(true));
    dispatch(toggleRightbar(true));
  };

  const handleShufflePlay = () => {
    if (!Array.isArray(songs) || songs.length === 0) {
      console.error("Danh sách bài hát trống hoặc không hợp lệ");
      return;
    }
  
    // Tạo một hàng đợi tạm thời từ danh sách bài hát
    const tempQueue = [...songs];
  
    // Trộn danh sách bài hát
    for (let i = tempQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempQueue[i], tempQueue[j]] = [tempQueue[j], tempQueue[i]];
    }
  
    // Nạp danh sách bài hát đã trộn vào Redux queue
    dispatch(clearQueue()); // Xóa queue cũ
    tempQueue.forEach((song) => {
      dispatch(addToQueue(song)); // Thêm từng bài hát vào queue
    });
  
    // Phát bài hát đầu tiên trong danh sách đã trộn
    dispatch(setSelectedSong(tempQueue[0]));
    dispatch(togglePlay(true));
    dispatch(toggleRightbar(true));
  };

  const handleDownloadAllSongs = async () => {
    if (!songQueue || songQueue.length === 0) {
      console.error("Hàng đợi bài hát trống");
      toast.error("Không có bài hát nào để tải xuống!");
      return;
    }

    try {
      for (const song of songQueue) {
        const response = await fetch(song.file_upload, {
          method: "GET",
        });

        if (!response.ok) {
          console.error(`Lỗi khi tải xuống bài hát: ${song.song_name}`);
          continue;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${song.song_name}.mp3`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success("Tải xuống tất cả bài hát thành công!");
    } catch (error) {
      console.error("Lỗi khi tải xuống bài hát:", error);
      toast.error("Tải xuống thất bại!");
    }
  };

  const content = (
    <div className="w-64 bg-gray-800 text-white rounded-lg shadow-lg p-2">
      <ul className="space-y-1">
        {type === "playlist" && (
          <>
            <li
              onClick={handleDownloadAllSongs}
              className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors duration-200 cursor-pointer rounded group">
              <MdDownloading size={20} className="mr-3 text-gray-400 group-hover:text-green-400" />
              <span>Tải xuống</span>
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors duration-200 cursor-pointer rounded group"
              onClick={handleDeletePlaylist}>
              <FaMinusCircle size={18} className="mr-3 text-gray-400 group-hover:text-red-400" />
              <span>Xóa</span>
            </li>
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors duration-200 cursor-pointer rounded group">
              <IoPencil size={18} className="mr-3 text-gray-400 group-hover:text-blue-400" />
              <span>Sửa thông tin</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col w-full rounded-xl bg-gradient-to-b from-[#868588] to-[#1A0A12] text-white custom-scrollbar">
      <PlaylistHeader type={type} />
      <div className="flex flex-col h-full w-full p-4 bg-black/20 ">
        <div className="flex flex-row items-center gap-4 m-3">
          <button
            onClick={handlePlaySonglist}
            className="w-14 h-14 rounded-full bg-[#1ED760] hover:scale-105 transition transform duration-200 flex items-center justify-center shadow-lg"
          >
            <ButtonPlay size={40} className="text-white" />
          </button>
          <div className="flex flex-row items-center gap-2 text-sm text-gray-400">
            {/* <MdDownloading size={45} className="hover:text-white"/> */}
          </div>

          <div className="flex flex-row items-center gap-2 text-sm text-gray-400">
            {/* Nút random */}
            <button
              onClick={handleShufflePlay}
              className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition transform duration-200 flex items-center justify-center shadow-lg"
              title="Phát ngẫu nhiên"
            >
              <FaRandom size={20} className="text-white" />
            </button>
          </div>

          {/* <Ellipsis className="scale-110 text-gray-400 hover:text-white cursor-pointer" /> */}
          {type === "playlist" &&
            <Popover placement='right' content={content} trigger="click">
              <EllipsisOutlined className="text-white text-4xl cursor-pointer hover:text-gray-400" />
            </Popover>
          }

        </div>
        <Playlist type={type} />
      </div>
    </div>
  );
};

export default PlaylistContent;
