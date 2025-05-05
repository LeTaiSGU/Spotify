import React from "react";
import PlaylistHeader from "./playlistheader";
import { IoPencil } from "react-icons/io5";
import ButtonPlay from "../ui/buttonplay";
import Playlist from "./playlist";
import { MdDownloading } from "react-icons/md";
import { FaMinusCircle } from "react-icons/fa";
import { Popover } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { deletePlaylist } from "~/apis/index";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchLibraryDetailsAPI } from "~/redux/slice/userLibrarySlice";
import { useDispatch } from "react-redux";
import { FaRandom } from "react-icons/fa";

function PlaylistContent(type) {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  

  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(playlistId);
      toast.success("Xóa playlist thành công")
      await dispatch(fetchLibraryDetailsAPI());
      navigate("/")
    } catch (error) {
      toast.error("Xóa playlist thất bại")
    }
  }

  const content = (
    <div className="w-64 bg-gray-800 text-white rounded-lg shadow-lg p-2">
      <ul className="space-y-1">
        <li className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors duration-200 cursor-pointer rounded group">
          <MdDownloading size={20} className="mr-3 text-gray-400 group-hover:text-green-400" />
          <span>Tải xuống</span>
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors duration-200 cursor-pointer rounded group"
          onClick={handleDeletePlaylist}>
          <FaMinusCircle size={18} className="mr-3 text-gray-400 group-hover:text-red-400" />
          <span>Xóa</span>
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors duration-200 cursor-pointer rounded group">
          <IoPencil size={18} className="mr-3 text-gray-400 group-hover:text-blue-400" />
          <span>Sửa thông tin</span>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col w-full rounded-xl bg-gradient-to-b from-[#868588] to-[#1A0A12] text-white custom-scrollbar">
      <PlaylistHeader />
      <div className="flex flex-col h-full w-full p-4 bg-black/20 ">
        <div className="flex flex-row items-center gap-4 m-3">
          <ButtonPlay />
          <div className="flex flex-row items-center gap-2 text-sm text-gray-400">
            {/* <MdDownloading size={45} className="hover:text-white"/> */}
          </div>

          <FaRandom size={25} className="hover:text-white text-gray-300"></FaRandom>

          {/* <Ellipsis className="scale-110 text-gray-400 hover:text-white cursor-pointer" /> */}
          <Popover placement='right' content={content} trigger="click">
            <EllipsisOutlined className="text-white text-4xl cursor-pointer hover:text-gray-400" />
          </Popover>

        </div>
        <Playlist />
      </div>
    </div>
  );
};

export default PlaylistContent;
