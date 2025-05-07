import React, { useRef, useEffect, useState } from "react";
import { message } from "antd";
import { saveAs } from "file-saver";
import Header from "./header";
import { X, Download, TvMinimalPlay } from "lucide-react";
import MarqueeSpan from "./marqueSpan.jsx";
import { useSelector, useDispatch } from "react-redux";
import { togglePlay } from "../../../redux/slice/songSlice";

const BoxArtist = ({ artistId, isMainArtist }) => {
  const [artistInfo, setArtistInfo] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/artists/${artistId}`
        );
        const data = await response.json();
        setArtistInfo(data);
      } catch (error) {
        console.error("Error fetching artist:", error);
      }
    };

    if (artistId) {
      fetchArtist();
    }
  }, [artistId]);

  if (!artistInfo) return null;
  return (
    <div className="flex flex-row items-center justify-between rounded-xl p-2 text-white">
      <div className="flex flex-col">
        <h2 className="text-base font-semibold">{artistInfo.name}</h2>
        <span className="text-sm text-[#bbbbbb] font-semibold">
          {isMainArtist ? "Tác giả" : "Nghệ sĩ tham gia"}
        </span>
      </div>
      <button className="text-sm text-white border border-gray-500 rounded-full px-3 py-1 hover:bg-gray-700">
        Theo dõi
      </button>
    </div>
  );
};

const ArtistSection = ({ song }) => {
  if (!song) return null;

  return (
    <div className="flex flex-col gap-4 m-2 px-4 bg-[#1f1f1f] rounded-xl p-4 mb-4 text-white">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-base font-semibold">Người tham gia thực hiện</h2>
      </div>

      {/* Hiển thị nghệ sĩ chính */}
      <BoxArtist
        key="artist-main"
        artistId={song.artist_owner}
        isMainArtist={true}
      />

      {/* Hiển thị danh sách nghệ sĩ phụ */}
      {Array.isArray(song.artists) &&
        song.artists.map((artistId, index) => (
          <BoxArtist
            key={`artist-${artistId}-${index}`}
            artistId={artistId}
            isMainArtist={false}
          />
        ))}
    </div>
  );
};

const Rightbar = () => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showMV, setShowMV] = useState(false);
  const dispatch = useDispatch();
  const selectedSong = useSelector((state) => state.songs.selectedSong);
  const [mainArtistInfo, setMainArtistInfo] = useState(null);

  //Test user
  const getUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch user:", error.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchMainArtist = async () => {
      if (selectedSong?.artist_owner) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/artists/${selectedSong.artist_owner}`
          );
          const data = await response.json();
          setMainArtistInfo(data);
        } catch (error) {
          console.error("Error fetching main artist:", error);
        }
      }
    };

    fetchMainArtist();
  }, [selectedSong?.artist_owner]);

  //mv
  const handleOpenMV = () => {
    setShowMV(true);
    // Pause the current playing song
    dispatch(togglePlay(false));
  };

  const handleCloseMV = () => {
    setShowMV(false);
  };

  //download
  // Add download handlers
  async function handleDownloadAudio(url, songName) {
    try {
      const user = await getUser(1); // hoặc thay 1 bằng userId thực tế nếu có

      console.log("User data:", user); // Kiểm tra dữ liệu người dùng
      if (!user || !user.is_premium) {
        message.info(
          "Vui lòng nâng cấp lên tài khoản premium để sử dụng chức năng này."
        );
        return;
      }

      const urlWithoutParams = url.split("?")[0];
      const extension = urlWithoutParams.substring(
        urlWithoutParams.lastIndexOf(".") + 1
      );

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Lỗi khi tải file âm thanh");
      }

      const blob = await response.blob();
      const fileName = `${songName}.${extension}`;
      saveAs(blob, fileName);
      message.success("Tải nhạc thành công!");
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      message.error("Đã xảy ra lỗi khi tải nhạc.");
    }
  }

  async function handleDownloadVideo(url, videoName) {
    try {
      const user = await getUser(1); // hoặc thay 1 bằng userId thực tế nếu có
      console.log("User data:", user); // Kiểm tra dữ liệu người dùng
      if (!user || !user.is_premium) {
        message.info(
          "Vui lòng nâng cấp lên tài khoản premium để sử dụng chức năng này."
        );
        return;
      }

      const urlWithoutParams = url.split("?")[0];
      const extension = urlWithoutParams.substring(
        urlWithoutParams.lastIndexOf(".") + 1
      );

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Lỗi khi tải video");
      }

      const blob = await response.blob();
      const fileName = `${videoName}.${extension}`;
      saveAs(blob, fileName);
      message.success("Tải video thành công!");
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      message.error("Đã xảy ra lỗi khi tải video.");
    }
  }
  // Add click outside handler
  const downloadMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target)
      ) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full flex flex-col ml-3 bg-stone-900 rounded-xl text-white w-[20%]">
      <Header />
      {/* <Video /> */}
      <div className="w-full px-4 mb-10 ">
        <img
          src={selectedSong?.img}
          alt={selectedSong?.song_name}
          className="w-full aspect-square object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-row justify-between px-4 items-center">
        <div className="flex flex-col flex-1 min-w-0 mr-4">
          {" "}
          {/* Added flex-1 and min-w-0 */}
          <MarqueeSpan>{selectedSong.song_name}</MarqueeSpan>
          <h2 className="text-sm text-gray-400 truncate">
            {selectedSong?.artist_owner?.name || "Loading..."}
          </h2>
        </div>
        <div className="flex flex-row gap-2 flex-shrink-0">
          {" "}
          {selectedSong?.mv && selectedSong.mv !== "none" && (
            <TvMinimalPlay
              className="my-4 hover:cursor-pointer hover:text-[#1DB954] transition-colors duration-200"
              onClick={handleOpenMV}
            />
          )}
          <div className="relative" ref={downloadMenuRef}>
            <Download
              className="my-4 hover:cursor-pointer hover:text-[#1DB954] transition-colors duration-200"
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            />
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 py-2 w-40 bg-[#282828] rounded-md shadow-lg z-50">
                <button
                  onClick={() =>
                    handleDownloadAudio(
                      selectedSong?.file_upload,
                      selectedSong?.song_name
                    )
                  }
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#1DB954] hover:cursor-pointer transition-colors duration-200"
                >
                  Tải nhạc
                </button>
                <button
                  onClick={() =>
                    handleDownloadVideo(
                      selectedSong?.mv,
                      selectedSong?.song_name
                    )
                  }
                  disabled={!selectedSong?.mv || selectedSong.mv === "none"}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 
                ${
                  selectedSong?.mv && selectedSong.mv !== "none"
                    ? "text-white hover:bg-[#1DB954] hover:cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                }`}
                >
                  Tải MV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MV Modal */}
        {showMV && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-[80vw] h-[80vh] bg-black rounded-lg">
              <button
                onClick={handleCloseMV}
                className="absolute top-4 right-4 text-white hover:text-[#1DB954] transition-colors duration-200 z-10"
              >
                <X size={24} />
              </button>
              <ReactPlayer
                url={selectedSong.mv}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                className="rounded-lg overflow-hidden"
              />
            </div>
          </div>
        )}
      </div>

      <ArtistSection song={selectedSong} />
    </div>
  );
};

export default Rightbar;
