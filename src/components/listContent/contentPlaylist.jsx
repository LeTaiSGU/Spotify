import React, { useState, useEffect, useRef } from "react";
import { Card } from "antd";
import mockData from "./mockData";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "../../style/contentPlaylist.css";

const MusicSession = () => {
  const [sessions, setSessions] = useState({ recommended: [], topCharts: [] });
  const recommendedRef = useRef(null);
  const topChartsRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setSessions(mockData);
    }, 500);
  }, []);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className="p-5 bg-[#121212] rounded-xl h-full text-white">
      <h2 className="text-xl font-bold mb-3">Recommended for You</h2>
      <div className="relative w-full">
        <button
          onClick={() => scroll(recommendedRef, "left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full shadow-lg z-10"
        >
          <LeftOutlined />
        </button>

        <div
          ref={recommendedRef}
          className="flex gap-4 overflow-x-auto hidden-scrollbar scroll-smooth px-12"
        >
          {sessions.recommended.map((song) => (
            <Card key={song.id} className="w-40 flex-shrink-0">
              <img
                src={song.cover}
                alt={song.title}
                className="w-40 h-20 object-cover"
              />
              <h3 className="mt-2 text-lg">{song.title}</h3>
              <p className="text-sm text-gray-500">{song.artist}</p>
            </Card>
          ))}
        </div>

        <button
          onClick={() => scroll(recommendedRef, "right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full shadow-lg z-10"
        >
          <RightOutlined />
        </button>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-3">Top Charts</h2>
      <div className="relative w-full">
        <button
          onClick={() => scroll(topChartsRef, "left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full shadow-lg z-10"
        >
          <LeftOutlined />
        </button>

        <div
          ref={topChartsRef}
          className="flex gap-4 overflow-x-auto hidden-scrollbar scroll-smooth px-12"
        >
          {sessions.topCharts.map((song) => (
            <Card key={song.id} className="w-40 flex-shrink-0">
              <img
                src={song.cover}
                alt={song.title}
                className="w-40 h-40 object-cover"
              />
              <h3 className="mt-2 text-lg">{song.title}</h3>
              <p className="text-sm text-gray-500">{song.artist}</p>
            </Card>
          ))}
        </div>

        <button
          onClick={() => scroll(topChartsRef, "right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full shadow-lg z-10"
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
};

export default MusicSession;
