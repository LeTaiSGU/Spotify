import React from "react";
import { Ellipsis, X } from "lucide-react";

const Header = () => {
  return (
    <div className="flex flex-row justify-between m-4">
      <h2 id="name" className="font-bold hover:underline hover:cursor-pointer">
        Artis name
      </h2>
      <div className="flex flex-row gap-4">
        <Ellipsis className="rounded-full hover:bg-gray-700 transition transform duration-200 hover:scale-110" />
        <X className="hover:bg-gray-700 rounded-full transition transform duration-200 hover:scale-110" />
      </div>
    </div>
  );
};

export default Header;
