// playlistheader.jsx
import { React, useState } from "react";
import avatar from "../../assets/avatar.png";
import { ImagePlus } from "lucide-react";
import EditPlaylistModal from "../sidebar/editPlaylist";
import PlaylistEditModal from "../sidebar/editPlaylist";

const Avatar = ({ src }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="mr-6 relative group" onClick={handleOpenModal}>
        <img
          src={src || "https://via.placeholder.com/150"}
          alt="Playlist Cover"
          className="w-48 h-48 object-cover shadow-lg m-5 rounded-sm transition-opacity group-hover:opacity-70"
        />
        <div className="absolute inset-0 m-5 w-48 h-48 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
        <ImagePlus className="absolute top-8 left-8 w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Hiển thị modal khi click */}
      <PlaylistEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Rap On Trap"
        description="Playlist A selection of carefully selected synthwave tracks to recharge your inspiration upon"
        cover={src || "https://via.placeholder.com/150"}
      />
    </>
  );
};

const PlaylistHeader = () => {
  // const [isExpanded, setIsExpanded] = useState(window.innerWidth > 650);
  const title = "Rap On Trap";
  const description =
    "Playlist A selection of carefully selected synthwave tracks to recharge your inspiration upon";

  const charCount = title.length;

  // Xác định class kích thước chữ dựa trên số ký tự
  let titleSizeClass;
  if (charCount <= 14) {
    titleSizeClass = "text-7xl";
  } else if (charCount <= 35) {
    titleSizeClass = "text-5xl";
  } else {
    titleSizeClass = "text-2xl";
  }

  return (
    <div className="flex flex-row w-full text-white">
      <Avatar src={avatar} />
      <div className="flex flex-col justify-end my-6">
        <h1 className="text-sm font-semibold my-2">Playlist</h1>
        <h1 className={`font-bold mb-2 ${titleSizeClass}`}>{title}</h1>

        <div className="relative group max-w-lg">
          {/* Văn bản bị cắt ngắn - điều chỉnh kích thước chữ */}
          <p className="mb-2 text-gray-300 truncate text-sm">{description}</p>

          {/* Tooltip hiển thị toàn bộ mô tả khi hover - cũng điều chỉnh kích thước chữ */}
          <div className="absolute hidden group-hover:block bottom-full mb-2 w-max max-w-md bg-gray-700 text-white text-xs p-2 rounded-lg shadow-lg z-10">
            {description}
          </div>
        </div>

        {/* Thông tin người tạo */}
        <span className="flex flex-row text-sm font-semibold justify-start items-center">
          <img
            alt="avatar"
            className="w-8 h-8 object-cover shadow-lg me-2 rounded-3xl"
          />
          <span className="font-bold hover:cursor-pointer hover:underline">
            Xavi Lê
          </span>
          <span className="ms-2 text-gray-300">25 bài hát, 1 giờ 8 phút</span>
        </span>
      </div>
    </div>
  );
};

export default PlaylistHeader;
