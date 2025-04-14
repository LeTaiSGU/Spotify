// src/components/Header.js
import React from "react";
import { Ellipsis, X } from "lucide-react";
import { useSelector } from "react-redux";

const Header = () => {
  // Lấy dữ liệu song từ Redux store
  const song = useSelector((state) => state.song.song);

  return (
    <div className="flex flex-row justify-between m-4">
      <h2 id="name" className="font-bold hover:underline hover:cursor-pointer">
        {song.artist1}
      </h2>
      <div className="flex flex-row gap-4">
        <Ellipsis className="rounded-full hover:bg-zinc-800 transition transform duration-200 hover:scale-110" />
        <X className="hover:bg-zinc-800 rounded-full transition transform duration-200 hover:scale-110" />
      </div>
    </div>
  );
};

export default Header;
