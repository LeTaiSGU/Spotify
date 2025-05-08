import React, { useState, useEffect } from 'react';
import { Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getTopArtistByUserId } from '~/apis'; // Import API

function AvatarBar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const [artists, setArtists] = useState([]); // State để lưu danh sách nghệ sĩ
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy danh sách nghệ sĩ
    const fetchArtists = async () => {
      try {
        const response = await getTopArtistByUserId(); // Gọi API
        setArtists(response); // Lưu danh sách nghệ sĩ vào state
      } catch (error) {
        console.error("Lỗi khi tải danh sách nghệ sĩ:", error);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    const updateVisibleItems = () => {
      let items = [];
      if (window.innerWidth >= 1024) items = artists.slice(0, 5); // lg: 5 phần tử
      else if (window.innerWidth >= 768) items = artists.slice(0, 4); // md: 4 phần tử
      else if (window.innerWidth >= 640) items = artists.slice(0, 3); // sm: 3 phần tử
      else items = artists.slice(0, 2); // xs: 2 phần tử

      setVisibleItems(items);
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, [artists]); // Cập nhật khi danh sách nghệ sĩ thay đổi

  return (
    <div className='p-6 bg-stone-900 '>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold text-white">Nghệ sĩ của bạn</h1>
        {artists.length >= 5 && ( // Chỉ hiển thị nút nếu có ít nhất 5 nghệ sĩ
          <span
            className="text-lg text-gray-400 cursor-pointer hover:text-white"
            onClick={() => { navigate("/user/more-artists") }}
          >
            Xem tất cả
          </span>
        )}
      </div>
      <div className='flex flex-row flex-nowrap overflow-hidden gap-4 place-content-start'>
        {
          visibleItems.map((item, index) => (
            index < 4 && (
              <div
                key={item.id} // Thêm key để tránh cảnh báo React
                className='flex flex-col hover:bg-gray-700 p-4 rounded-lg relative'
                onMouseLeave={() => setHoveredIndex(null)}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <Avatar src={item.avatar} size={150} />
                <p className='text-start text-xl font-medium mt-3 text-white'>{item.name}</p>
                <p className="self-start text-xl font-medium mt-2 text-gray-400">Artist</p>
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`absolute bottom-20 right-5 transition-opacity duration-200 ${hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <circle cx="30" cy="30" r="30" fill="#1ED760" />
                  <polygon points="23,18 45,30 23,42" fill="black" />
                </svg>
              </div>
            )
          ))
        }
      </div>
    </div>
  );
}

export default AvatarBar;