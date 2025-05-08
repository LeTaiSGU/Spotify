import { useEffect } from "react";
import React from "react";
import { Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLibraryDetailsAPI, selectUserLibrary } from "~/redux/slice/userLibrarySlice";
import { useNavigate } from "react-router-dom";

const SidebarPlaylists = () => {
  const dispatch = useDispatch();
  const libraryDetails = useSelector(selectUserLibrary);
  const navigate = useNavigate();

  const navigateToItem = (playlistId, item_type) => {
    console.log("Item Type:", item_type);
    if (item_type === "playlist") {
      navigate(`/playlist/${playlistId}`);
    } else if (item_type === "album") {
      navigate(`/album/${playlistId}`);
    } else if (item_type === "song") {
      navigate(`/song/${playlistId}`);
    }
  };

  useEffect(() => {
    dispatch(fetchLibraryDetailsAPI());
  }, [dispatch]);


  // const handleClick = async (id, type) => {
  //   try {
  //     console.log("ID:", id);
  //     // Lấy danh sách bài hát từ API
  //     navigateToItem(id,type)
  //     const songs = await getSongBylistId(id);
  //     // Xóa queue cũ
  //     dispatch(clearQueue());
  
  //     // Thêm danh sách bài hát mới vào queue
  //     songs.forEach((song) => {
  //       dispatch(
  //         addToQueue({
  //           ...song,
  //           file_upload: song.file_upload,
  //         })
  //       );
  //     });

  
  //     console.log("Danh sách bài hát đã được thêm vào queue:", songs);
  //   } catch (error) {
  //     console.error("Lỗi khi xử lý playlist:", error);
  //   }
  // };

  const handleClick = async (id, type) => {
    try {
      console.log("ID:", id);
      navigateToItem(id, type); // Chỉ điều hướng đến playlist/album/song
    } catch (error) {
      console.error("Lỗi khi xử lý playlist:", error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
       
        {libraryDetails?.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 mx-2 rounded-md hover:bg-gray-700 cursor-pointer"
            onClick={() => handleClick(item.id, item.item_type)}
          >
            <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
              {item.isLiked ? (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Heart className="text-white fill-white" size={24} />
                </div>
              ) : (
                <img
                  src={item?.cover_image || "/placeholder.svg"}
                  alt={item?.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {item.name}
              </span>
              <div className="flex items-center text-xs text-zinc-400">
                <span className="truncate">{item.item_type}</span>
              </div>
            </div>
          </div>
        ))}
      
    </div>
  );
};

export default SidebarPlaylists;