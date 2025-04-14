import React from 'react';
import { Avatar } from 'antd';
import { useState, useEffect } from 'react';



const mockData = [
  {
    avatar: "https://i.pravatar.cc/150?img=1",
    displayname: "Nguyễn Văn A"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=2",
    displayname: "Trần Thị B"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=3",
    displayname: "Lê Văn C"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=4",
    displayname: "Phạm Thị D"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=5",
    displayname: "Hoàng Văn E"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=6",
    displayname: "Đặng Thị F"
  },

];




function AvatarBar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const updateVisibleItems = () => {
      let items = [];
      if (window.innerWidth >= 1024) items = mockData.slice(0, 5); // lg: 5 phần tử
      else if (window.innerWidth >= 768) items = mockData.slice(0, 4); // md: 4 phần tử
      else if (window.innerWidth >= 640) items = mockData.slice(0, 3); // sm: 3 phần tử
      else items = mockData.slice(0, 2); // xs: 2 phần tử

      setVisibleItems(items);
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  return (
    <div className='p-6 bg-zinc-950 '>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold text-white">Avatar</h1>
        <span className="text-lg text-gray-400 cursor-pointer hover:text-white">Xem tất cả</span>
      </div>
      <div className='flex flex-row flex-nowrap overflow-hidden gap-4 place-content-around'>
        {
          visibleItems.map( (item,index) => (
            <div className='flex flex-col hover:bg-gray-700 p-4 rounded-lg relative' onMouseLeave={() => setHoveredIndex(null)} onMouseEnter={() => setHoveredIndex(index)}>
              <Avatar src={item.avatar} size={150} />
              <p className='text-start text-xl font-medium mt-3'>{item.displayname}</p>
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
          ))
        }
      </div>


    </div>
  )
}

export default AvatarBar;