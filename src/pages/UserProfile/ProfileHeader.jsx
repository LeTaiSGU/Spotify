import React from "react";
import { useState } from "react";
import { GoPencil } from "react-icons/go";
import { Modal, Input, Button } from 'antd';



function ProfileHeader() {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="!w-full !max-w-none !p-0">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 flex items-center space-x-6 min-h-[250px]">

        <div
          className="relative w-70 h-70 rounded-full overflow-hidden cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => document.getElementById("avatarInput").click()}
        >
          <img
            src="https://i.pravatar.cc/300"
            alt="Avatar"
            className={`w-full h-full object-cover transition-all duration-300 ${isHovered ? "blur-xs brightness-75" : ""
              }`}
          />

          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-opacity-50 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
              }`}
          >
            <GoPencil className="w-20 h-20 text-white mb-1" />
            <p className="text-white text-sm font-medium">Chọn ảnh</p>
          </div>
        </div>

        <div className="text-white">
          <p className="text-lg text-gray-300">Hồ sơ</p>
          <h1 className="text-8xl font-bold" onClick={showModal}>User 01</h1>
          <p className="text-gray-400 text-lg mt-2">
            12 danh sách phát công khai <span className="text-white font-semibold">• 2 người theo dõi • 70 đang theo dõi</span>
          </p>
        </div>
        <input
          type="file"
          id="avatarInput"
          className="hidden"
        />
      </div>

      <Modal title="Chi tiết hồ sơ" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
        <div className="flex items-center gap-5">
        <div
          className="relative w-50 h-50 rounded-full overflow-hidden cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => document.getElementById("avatarInput").click()}
        >
          <img
            src="https://i.pravatar.cc/300"
            alt="Avatar"
            className={`w-full h-full object-cover transition-all duration-300 ${isHovered ? "blur-xs brightness-75" : ""
              }`}
          />

          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-opacity-50 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
              }`}
          >
            <GoPencil className="w-20 h-20 text-white mb-1" />
            <p className="text-white text-sm font-medium">Chọn ảnh</p>
          </div>



        </div>
        <div>
          <Input className="w-100"></Input>
        </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileHeader;