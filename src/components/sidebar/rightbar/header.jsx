// src/components/Header.js
import React from "react";
import { Ellipsis, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleRightbar } from "../../../redux/slice/songSlice";

const Header = () => {
  // Lấy dữ liệu song từ Redux store
  const dispatch = useDispatch();
  const selectedSong = useSelector((state) => state.songs.selectedSong);

  const handleClose = () => {
    dispatch(toggleRightbar(false));
  };

  return (
    <div className="flex flex-row justify-between m-4">
      <h2 id="name" className="font-bold hover:underline hover:cursor-pointer">
        {selectedSong.song_name}
      </h2>
      <div className="flex flex-row gap-4">
        <Ellipsis className="rounded-full hover:bg-gray-700 transition transform duration-200 hover:scale-110" />
        <X
          className="hover:bg-gray-700 rounded-full transition transform duration-200 hover:scale-110"
          onClick={handleClose}
        />
      </div>
    </div>
  );
};

export default Header;
