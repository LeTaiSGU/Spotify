import React, { useCallback, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { togglePlay, toggleRightbar, setSelectedSong, addToQueue } from "../../redux/slice/songSlice";
import "./BottomPlayer.css";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaRandom,
  FaRedo,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { Maximize, Minimize } from "lucide-react";
import adsMusic from "../../assets/ads-music.mp3";


const timeStringToSeconds = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const BottomPlayer = () => {
  const dispatch = useDispatch();
  const [isRepeat, setIsRepeat] = useState(false);
  const [daCapNhatLuotNghe, setDaCapNhatLuotNghe] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isShuffle, setIsShuffle] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const audioRef = useRef(null);
  const isRightbarVisible = useSelector(
    (state) => state.songs.isRightbarVisible
  );
  const handleToggleRightbar = () => {
    dispatch(toggleRightbar(!isRightbarVisible));
  };

  const Currentuser = useSelector((state) => state.auth.user);
  const isPremium = Currentuser?.is_premium;

  const { selectedSong, isPlaying, songQueue } = useSelector((state) => state.songs);

  const [songCounter, setSongCounter] = useState(0);



  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (selectedSong && audioRef.current) {
      // Chỉ update source khi có bài hát mới
      if (audioRef.current.src !== selectedSong.file_upload) {
        audioRef.current.src = selectedSong.file_upload;
        // Không tự động phát khi chỉ thay đổi source
      }

      // Chỉ phát/dừng khi isPlaying thay đổi
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.error("Lỗi khi phát:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [selectedSong, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!selectedSong) return;
    dispatch(togglePlay(!isPlaying));
  };

  const handleTimeChange = (e) => {
    if (selectedSong?.isAd) return; // Không cho phép tua nếu là quảng cáo
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    setPreviousVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    setIsMuted(false);
  };


  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      if (audioRef.current) audioRef.current.volume = previousVolume / 100;
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // const toggleRepeat = () => {
  //   // Nếu bật chế độ lặp lại, tắt chế độ ngẫu nhiên
  //   if (isRandom) {
  //     dispatch(toggleRandom());
  //   }
  //   const nextMode = (repeatMode + 1) % 3;
  //   dispatch(setRepeatMode(nextMode));
  // };

  // const handleToggleRandom = () => {
  //   if (!currentSong) return;
  //   // Nếu bật chế độ ngẫu nhiên, tắt chế độ lặp lại
  //   if (repeatMode > 0) {
  //     dispatch(setRepeatMode(0));
  //   }
  //   dispatch(toggleRandom());
  // };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };


  const handleNextSong = () => {
    if (!songQueue || songQueue.length === 0) {
      console.error("Hàng đợi bài hát trống");
      return;
    }

    const currentIndex = songQueue.findIndex((song) => song.id === selectedSong?.id);

    if (currentIndex === -1) {
      console.error("Bài hát hiện tại không có trong hàng đợi");
      return;
    }

    let nextIndex;

    if (isShuffle) {
      // Chọn bài hát ngẫu nhiên
      do {
        nextIndex = Math.floor(Math.random() * songQueue.length);
      } while (nextIndex === currentIndex); // Đảm bảo không lặp lại bài hiện tại
    } else {
      nextIndex = currentIndex + 1;
    }

    // Nếu đang ở bài cuối cùng và không bật trộn bài
    if (nextIndex >= songQueue.length && !isShuffle) {
      console.log("Đã đến bài cuối cùng trong hàng đợi");
      if (isRepeat) {
        dispatch(setSelectedSong(songQueue[0])); // Phát lại từ đầu
        dispatch(togglePlay(true));
      } else {
        dispatch(togglePlay(false)); // Dừng phát
      }
      return;
    }

    const nextSong = songQueue[nextIndex];

    setSongCounter((prev) => prev + 1);

    if (!isPremium && songCounter + 1 === 2) {
      const ad = {
        song_name: "Quảng cáo",
        duration: "00:00:30",
        img: "https://via.placeholder.com/150",
        file_upload: adsMusic,
        description: "Đây là quảng cáo",
        mv: "none",
        play_count: 0,
        status: true,
        isAd: true,
      };

      // Lưu bài hát tiếp theo để phát sau quảng cáo
      dispatch(setSelectedSong(ad)); // Phát quảng cáo
      dispatch(togglePlay(true));
      setSongCounter(0); // Reset bộ đếm

      // Sau khi quảng cáo kết thúc, phát bài hát tiếp theo
      audioRef.current.onended = () => {
        dispatch(setSelectedSong(nextSong));
        dispatch(togglePlay(true));
      };

      return;
    }

    // Phát bài hát tiếp theo
    dispatch(setSelectedSong(nextSong));
    dispatch(togglePlay(true));
  };




  const handlePreviousSong = () => {
    if (!songQueue || songQueue.length === 0) {
      console.error("Hàng đợi bài hát trống");
      return;
    }

    const currentIndex = songQueue.findIndex((song) => song.id === selectedSong?.id);

    if (currentIndex === -1) {
      console.error("Bài hát hiện tại không có trong hàng đợi");
      return;
    }

    const previousIndex = currentIndex - 1;

    // Nếu đang ở bài đầu tiên
    if (previousIndex < 0) {
      console.log("Đang ở bài đầu tiên trong hàng đợi");
      if (isRepeat) {
        // Nếu chế độ lặp lại được bật, phát bài cuối cùng
        dispatch(setSelectedSong(songQueue[songQueue.length - 1]));
        dispatch(togglePlay(true));
      } else {
        // Nếu không, dừng phát
        dispatch(togglePlay(false));
      }
      return;
    }

    // Phát bài hát trước đó
    const previousSong = songQueue[previousIndex];
    dispatch(setSelectedSong(previousSong));
    dispatch(togglePlay(true));
  };

  //update listening counts
  // Thêm useEffect mới để theo dõi thời gian nghe
  useEffect(() => {
    const capNhatLuotNghe = async () => {
      if (!audioRef.current || !selectedSong || daCapNhatLuotNghe) return;

      const tongThoiGian = audioRef.current.duration;
      const thoiGianHienTai = audioRef.current.currentTime;

      if (thoiGianHienTai > tongThoiGian * 0.75) {
        try {
          console.log("Đã nghe hơn 75% bài hát");
          const response = await fetch(
            `http://localhost:8000/api/songs/playcount/${selectedSong.id}`,
            {
              method: "put",
            }
          );

          if (response.ok) {
            setDaCapNhatLuotNghe(true);
            console.log("Đã cập nhật lượt nghe thành công");
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật lượt nghe:", error);
        }
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", capNhatLuotNghe);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", capNhatLuotNghe);
      }
    };
  }, [selectedSong, daCapNhatLuotNghe]);

  const handleAudioEnd = useCallback(() => {
    console.log("Audio ended - Resetting state");
    const currentIndex = songQueue?.findIndex((song) => song.id === selectedSong?.id);
    const nextSong = songQueue[currentIndex + 1];


    // if (isRepeat && audioRef.current) {
    //   audioRef.current.currentTime = 0;
    //   audioRef.current.play();
    //   return;
    // }

    // Reset thời gian về 0
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }

    if (nextSong) {
      dispatch(setSelectedSong(nextSong)); // Chọn bài hát tiếp theo
      dispatch(togglePlay(true)); // Phát bài hát tiếp theo
    } else {
      dispatch(togglePlay(false)); // Dừng phát nếu không còn bài hát
    }



    // Sau đó mới cập nhật các state khác
    setDaCapNhatLuotNghe(false);
    // dispatch(togglePlay(false));

    // console.log("Đã reset time và state");
  }, [dispatch, isRepeat, songQueue, selectedSong, setCurrentTime]);
  // Thêm useEffect để reset trạng thái khi đổi bài
  useEffect(() => {
    // Chỉ reset daCapNhatLuotNghe khi thay đổi bài hát
    if (selectedSong) {
      setDaCapNhatLuotNghe(false);
    }

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("ended", handleAudioEnd);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleAudioEnd);
      }
    };
  }, [selectedSong, handleAudioEnd]);

  const formatTime = (seconds) => {
    if (!seconds) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const pad = (num) => String(num).padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  //artist owner
  const [mainArtistInfo, setMainArtistInfo] = useState(null);

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

  return (
    <div className="bottom-player">
      {selectedSong ? (
        <div className="song-info">
          <img src={selectedSong.img} alt="Album" className="album-cover" />
          <div className="song-details">
            <span className="song-title">{selectedSong.song_name}</span>
            <span className="song-artist">
              {selectedSong?.artist_owner?.name || "Loading..."}
            </span>
          </div>
        </div>
      ) : (
        <div className="song-placeholder text-gray-400">
          Chưa có bài hát nào được chọn.
        </div>
      )}

      <div className="controls">
        <div className="control-buttons">
          <button
            className={`control-btn ${isShuffle ? "active" : ""}`}
            onClick={() => setIsShuffle(!isShuffle)}
            title={isShuffle ? "Tắt trộn bài" : "Bật trộn bài"}
          >
            <FaRandom />
          </button>
          <button
            className="control-btn"
            onClick={handlePreviousSong}
          // disabled={
          //   !currentSong ||
          //   queue.length === 0 ||
          //   (queue.findIndex((s) => s.songId === currentSong.songId) === 0 &&
          //     repeatMode !== 2)
          // }
          >
            <FaStepBackward />
          </button>
          <button
            className="play-pause-btn"
            onClick={togglePlayPause}
            disabled={!selectedSong}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            className="control-btn"
            onClick={handleNextSong}
          // disabled={
          //   !currentSong ||
          //   queue.length === 0 ||
          //   (queue.findIndex((s) => s.songId === currentSong.songId) ===
          //     queue.length - 1 &&
          //     repeatMode !== 2)
          // }
          >
            <FaStepForward />
          </button>
          <button
            // className={`control-btn ${repeatMode > 0 ? "active" : ""}`}
            // onClick={toggleRepeat}
            // disabled={!currentSong}
            // title={
            //   repeatMode === 0
            //     ? "Bật lặp lại"
            //     : repeatMode === 1
            //     ? "Lặp lại một bài"
            //     : "Lặp lại playlist"
            // }
            className={`control-btn ${isRepeat ? "active" : ""}`}
            onClick={() => setIsRepeat(!isRepeat)}
            title={isRepeat ? "Tắt lặp lại" : "Bật lặp lại"}
          >
            <FaRedo />
            {/* {repeatMode === 1 && <span className="repeat-indicator">1</span>} */}
          </button>
        </div>

        {/* Thanh thời gian */}
        <div className="progress-bar">
          {selectedSong ? (
            <>
              <span className="current-time">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={timeStringToSeconds(selectedSong.duration)}
                value={currentTime}
                onChange={handleTimeChange}
                className="progress-slider"
                disabled={selectedSong.isAd} // Vô hiệu hóa nếu là quảng cáo
              />
              <span className="remaining-time">
                {formatTime(
                  timeStringToSeconds(selectedSong.duration) - currentTime
                )}
              </span>
            </>
          ) : (
            <>
              <span className="current-time">00:00:00</span>
              <input
                type="range"
                min="0"
                max="100"
                value="0"
                className="progress-slider"
                disabled
              />
              <span className="remaining-time">00:00:00</span>
            </>
          )}
        </div>
      </div>

      <div className="extra-controls">
        <button
          className="control-btn"
          onClick={toggleMute}
          disabled={!selectedSong}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            disabled={!selectedSong}
          />
        </div>
        {selectedSong && (
          <button
            className={`control-btn rightbar-toggle ${isRightbarVisible ? "active" : ""
              }`}
            onClick={handleToggleRightbar}
            title={isRightbarVisible ? "Ẩn sidebar" : "Hiện sidebar"}
          >
            {isRightbarVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            )}
          </button>
        )}
        <button className="control-btn maximize-btn" onClick={toggleFullScreen}>
          {isFullScreen ? <Minimize /> : <Maximize />}
        </button>
      </div>

      {selectedSong && (
        <audio
          ref={audioRef}
          src={selectedSong?.fileUpload}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNextSong}
        />
      )}
    </div>
  );
};

export default BottomPlayer;
