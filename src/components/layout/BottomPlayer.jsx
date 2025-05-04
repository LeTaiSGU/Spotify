import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { togglePlay } from "../../redux/slice/songSlice";
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

const timeStringToSeconds = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const BottomPlayer = () => {
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const audioRef = useRef(null);

  const { selectedSong, isPlaying } = useSelector((state) => state.songs);

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

  // const handleNextSong = () => {
  //   if (!currentSong || queue.length === 0) return;

  //   const currentIndex = queue.findIndex(
  //     (s) => s.songId === currentSong.songId
  //   );

  //   // Nếu đang ở bài cuối cùng
  //   if (currentIndex === queue.length - 1) {
  //     // Chỉ cho phép phát lại từ đầu nếu repeatMode === 2 (lặp lại playlist/album)
  //     if (repeatMode === 2) {
  //       dispatch(playNextSong());
  //     }
  //     return;
  //   }

  //   dispatch(playNextSong());
  // };

  // const handlePreviousSong = () => {
  //   if (!currentSong || queue.length === 0) return;

  //   const currentIndex = queue.findIndex(
  //     (s) => s.songId === currentSong.songId
  //   );

  //   // Nếu đang ở bài đầu tiên
  //   if (currentIndex === 0) {
  //     // Chỉ cho phép phát bài cuối nếu repeatMode === 2 (lặp lại playlist/album)
  //     if (repeatMode === 2) {
  //       dispatch(playPreviousSong());
  //     }
  //     return;
  //   }

  //   dispatch(playPreviousSong());
  // };

  // const handleSongEnded = async () => {
  //   if (repeatMode === 1) {
  //     audioRef.current.currentTime = 0;
  //     audioRef.current.play();
  //     return;
  //   }

  //   const currentIndex = queue.findIndex(
  //     (s) => s?.songId === currentSong?.songId
  //   );

  //   // Nếu đang phát playlist và bật random
  //   if (queue.length > 1 && isRandom) {
  //     dispatch(playNextSong()); // Sẽ random trong queue hiện tại
  //     return;
  //   }

  //   // Nếu là bài cuối hoặc chỉ có 1 bài trong queue (single song)
  //   if (currentIndex === queue.length - 1 || queue.length === 1) {
  //     if (repeatMode === 2) {
  //       dispatch(playNextSong());
  //     } else {
  //       try {
  //         // Fetch random song mới
  //         const excludeSongId = currentSong?.songId;
  //         const result = await dispatch(
  //           fetchRandomSong(excludeSongId)
  //         ).unwrap();

  //         if (result) {
  //           // Đè queue cũ và phát ngay
  //           dispatch(clearQueue());
  //           dispatch(setQueue([result]));
  //           dispatch(setCurrentSong(result));
  //           dispatch(togglePlay(true));

  //           // Cập nhật audio
  //           if (audioRef.current) {
  //             audioRef.current.src = result.fileUpload;
  //             audioRef.current.load();
  //             audioRef.current
  //               .play()
  //               .catch((error) =>
  //                 console.error("Error playing new random song:", error)
  //               );
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error fetching random song:", error);
  //         dispatch(togglePlay(false));
  //       }
  //     }
  //   } else {
  //     // Còn bài tiếp theo trong queue
  //     dispatch(playNextSong());
  //   }
  // };

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
            <span className="song-artist">{mainArtistInfo.name}</span>
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
          // className={`control-btn ${isRandom ? "active" : ""}`}
          // onClick={handleToggleRandom}
          // disabled={!currentSong}
          // title={isRandom ? "Tắt phát ngẫu nhiên" : "Bật phát ngẫu nhiên"}
          >
            <FaRandom />
          </button>
          <button
          // className="control-btn"
          // onClick={handlePreviousSong}
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
          // className="control-btn"
          // onClick={handleNextSong}
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
                disabled={!selectedSong}
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
        <button className="control-btn maximize-btn" onClick={toggleFullScreen}>
          {isFullScreen ? <Minimize /> : <Maximize />}
        </button>
      </div>

      {selectedSong && (
        <audio
          ref={audioRef}
          src={selectedSong.fileUpload}
          onTimeUpdate={handleTimeUpdate}
          onEnded={selectedSong}
        />
      )}
    </div>
  );
};

export default BottomPlayer;
