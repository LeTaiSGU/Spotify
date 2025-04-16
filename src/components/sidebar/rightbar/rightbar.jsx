import React from "react";
import Video from "./video";
import Header from "./header";
import { PlusCircle } from "lucide-react"; // Import component vừa tạo
import MarqueeSpan from "./marqueSpan.jsx";

const Rightbar = () => {
  return (
    <div className="h-full flex flex-col ml-3 bg-stone-900 rounded-xl text-white w-[20%]">
      <Header />
      <Video />
      <div className="flex flex-row justify-between px-4">
        <div className="flex flex-col">
          <MarqueeSpan>Songs 1</MarqueeSpan>
          <h2>Artis name</h2>
        </div>
        <PlusCircle className="my-4" />
      </div>
    </div>
  );
};

export default Rightbar;
