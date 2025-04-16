import React from "react";
import PlaylistHeader from "./playlistheader";
import { Ellipsis } from "lucide-react";
import ButtonPlay from "../ui/buttonplay";
import Playlist from "./playlist";

const PlaylistContent = () => {
  return (
    <div className="flex flex-col w-full rounded-xl bg-gradient-to-b from-[#868588] to-[#1A0A12] text-white custom-scrollbar">
      <PlaylistHeader />
      <div className="flex flex-col h-full w-full p-4 bg-black/20 ">
        <div className="flex flex-row items-center gap-4 m-3">
          <ButtonPlay />
          <Ellipsis className="scale-110 text-gray-400 hover:text-white cursor-pointer" />
        </div>
        <Playlist />
      </div>
    </div>
  );
};

export default PlaylistContent;
