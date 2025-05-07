import React from "react";
import { GoPencil } from "react-icons/go";

function ProfileHeader({ artist }) {
  // Loại bỏ state liên quan đến modal vì đây là trang xem nghệ sĩ, không phải chỉnh sửa

  return (
    <div className="!w-full !max-w-none !p-0">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 flex items-center space-x-6 min-h-[250px]">
        {/* Avatar nghệ sĩ */}
        <div className="relative w-70 h-70 rounded-full overflow-hidden">
          <img
            src={artist?.avatar || "https://via.placeholder.com/300"}
            alt={artist?.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-white">
          <p className="text-lg text-gray-300">Nghệ sĩ</p>
          <h1 className="text-8xl font-bold">
            {artist?.name || "Unknown Artist"}
          </h1>
          {artist?.followers && (
            <p className="mt-2 text-gray-300">
              {artist.followers.toLocaleString()} người theo dõi
            </p>
          )}
          {artist?.description && (
            <p className="mt-2 text-gray-300 line-clamp-2">
              {artist.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
