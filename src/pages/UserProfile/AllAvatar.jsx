import React, { useState, useEffect } from "react";
import { Avatar } from "antd";

const mockData = [
  { avatar: "https://i.pravatar.cc/150?img=1", displayname: "Nguyễn Văn A" },
  { avatar: "https://i.pravatar.cc/150?img=2", displayname: "Trần Thị B" },
  { avatar: "https://i.pravatar.cc/150?img=3", displayname: "Lê Văn C" },
  { avatar: "https://i.pravatar.cc/150?img=4", displayname: "Phạm Thị D" },
  { avatar: "https://i.pravatar.cc/150?img=5", displayname: "Hoàng Văn E" },
  { avatar: "https://i.pravatar.cc/150?img=6", displayname: "Đặng Thị F" },
];

function AllAvatar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [avatarSize, setAvatarSize] = useState(100);
  const [svgSize, setSvgSize] = useState(40);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth >= 1024) {
        setAvatarSize(150);
        setSvgSize(50); // Kích thước lớn
      } else if (window.innerWidth >= 768) {
        setAvatarSize(120);
        setSvgSize(50); // Kích thước trung bình
      } else {
        setAvatarSize(100);
        setSvgSize(40); // Kích thước nhỏ
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">Nghệ sĩ hàng đầu tháng này</h1>
      <p className="text-gray-400 mb-6">Chỉ hiển thị với bạn</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {mockData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-5 rounded-lg relative transition-all duration-200 hover:bg-zinc-800 "
            onMouseLeave={() => setHoveredIndex(null)}
            onMouseEnter={() => setHoveredIndex(index)}
          >
            <Avatar src={item.avatar} size={avatarSize} />
            <p className="self-start text-xl font-medium mt-3">{item.displayname}</p>
            <p className="self-start text-lg text-gray-400">Artist</p>

            {hoveredIndex === index && (
              <svg
                width={svgSize}
                height={svgSize}
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute bottom-20 right-4 transition-transform duration-200 opacity-100 scale-105"
              >
                <circle cx="30" cy="30" r="30" fill="#1ED760" />
                <polygon points="23,18 45,30 23,42" fill="black" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllAvatar;
