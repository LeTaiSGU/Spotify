import React, { useState } from "react";
import { GoPencil } from "react-icons/go";
import { Modal, Input, Spin, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { updateUser } from "~/apis";
import { toast } from "react-toastify";

function ProfileHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDob, setUpdatedDob] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const currentUserLibrary = useSelector(
    (state) => state.userLibrary.currentUserLibrary
  );

  // Lọc danh sách playlist công khai
  const publicPlaylists = currentUserLibrary.filter(
    (item) => item.item_type === "playlist" && item.is_private === false
  );
  const user = useSelector((state) => state.auth.user);
  const { name, dob, avatar } = user;

  // Default avatar if none exists
  const defaultAvatar =
    "https://i.pinimg.com/originals/7d/34/d9/7d34d9d53640af5cfd2614c57dfa7f13.png";

  // Use avatar if available, otherwise use default
  const displayAvatar = avatar || defaultAvatar;

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleOk = async () => {
    try {
      // Validate dữ liệu trước khi gửi
      if (!updatedName || updatedName.trim() === "") {
        toast.error("Vui lòng nhập tên người dùng.");
        return;
      }
  
      const updatedData = {
        name: updatedName,
      };
  
      if (updatedDob) {
        updatedData.dob = updatedDob;
      }
  
      // Nếu có avatar mới, thêm vào FormData
      const data = new FormData();
      data.append("data", JSON.stringify(updatedData));
      if (avatarFile) {
        data.append("img_upload", avatarFile);
      }
  
      // Gửi yêu cầu cập nhật
      await updateUser(user.id, data);
  
      // Hiển thị thông báo thành công
      toast.success("Cập nhật thông tin thành công!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  return (
    <div className="!w-full !max-w-none !p-0">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center md:space-x-6 min-h-[200px] md:min-h-[250px]">
        {/* Avatar ngoài */}
        <div
          className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-70 md:h-70 rounded-full overflow-hidden cursor-pointer group mb-4 md:mb-0"
          onClick={showModal}
        >
          <img
            src={displayAvatar}
            alt={`Avatar của ${name}`}
            className="w-full h-full object-cover transition-all duration-300 group-hover:blur-xs group-hover:brightness-75"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            <GoPencil className="w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20 text-white mb-1" />
            <p className="text-white text-xs sm:text-sm font-medium">
              Chỉnh sửa
            </p>
          </div>
        </div>

        <div className="text-white text-center md:text-left">
          <p className="text-base sm:text-lg text-gray-300">Hồ sơ</p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl font-bold">
            {name}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-2">
            {publicPlaylists.length} danh sách phát công khai{" "}
          </p>
        </div>
        <input
          type="file"
          id="avatarInput"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Modal chỉnh sửa hồ sơ */}
      <Modal
        title="Chi tiết hồ sơ"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        className="sm:w-[400px] md:w-[600px]"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Ngăn chặn reload trang
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
            {/* Avatar trong modal */}
            <div
              className="relative w-50 h-40 rounded-full overflow-hidden cursor-pointer group mb-3 sm:mb-0 border-2 border-gray-700"
              onClick={() => document.getElementById("avatarInput").click()}
            >
              <img
                src={avatarFile ? URL.createObjectURL(avatarFile) : displayAvatar}
                alt={`Avatar của ${name}`}
                className="w-full h-full object-cover transition-all duration-300 group-hover:blur-xs group-hover:brightness-75"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <GoPencil className="w-10 h-10 text-white" />
                <p className="text-white text-sm font-medium mt-2">Chọn ảnh</p>
              </div>
            </div>

            <div className="w-full">
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 block">
                  Tên người dùng
                </label>
                <Input
                  className="w-full !border-none"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)} // Cập nhật state
                />
              </div>
            </div>
          </div>
          <button type="submit" className="hidden"></button>{" "}
          {/* Nút submit ẩn */}
        </form>
      </Modal>
    </div>
  );
}

export default ProfileHeader;