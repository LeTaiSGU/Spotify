// src/features/songSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ROOT } from "~/utils/constants";

export const fetchTopSongs = createAsyncThunk(
  "songs/fetchTopSongs",
  async () => {
    const response = await fetch(`${API_ROOT}/api/songs/top`);
    if (!response.ok) {
      throw new Error("Failed to fetch top songs");
    }
    const data = await response.json();
    return data;
  }
);

const initialState = {
  songs: [], // Danh sách bài hát
  loading: false, // Trạng thái loading
  error: null, // Lưu trữ lỗi nếu có
  songQueue: [], // Hàng đợi phát nhạc
  selectedSong: null, // Bài hát đang được chọn
  showPlaylistContent: false, // Trạng thái hiển thị playlist
  isPlaying: false, // Trạng thái phát nhạc
};

const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    // Thêm bài hát vào hàng đợi
    addToQueue: (state, action) => {
      state.songQueue.push(action.payload);
    },
    // Xóa bài hát khỏi hàng đợi
    removeFromQueue: (state, action) => {
      state.songQueue = state.songQuene.filter(
        (song) => song.songId !== action.payload.songId
      );
    },
    // Xóa toàn bộ hàng đợi
    clearQueue: (state) => {
      state.songQueue = [];
    },
    // Cập nhật bài hát được chọn
    setSelectedSong: (state, action) => {
      state.selectedSong = action.payload;
      state.showPlaylistContent = !!action.payload; // Đặt trạng thái phát nhạc là true khi có bài hát được chọn
    },
    // Cập nhật trạng thái hiển thị playlist
    setShowPlaylistContent: (state, action) => {
      state.showPlaylistContent = action.payload;
      if (!action.payload) {
        state.selectedSong = null;
      }
    },
    togglePlay: (state, action) => {
      state.isPlaying = action.payload;
    },
    toggleRightbar: (state, action) => {
      state.isRightbarVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload;
      })
      .addCase(fetchTopSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export các actions
export const {
  addToQueue,
  removeFromQueue,
  clearQueue,
  setSelectedSong,
  setShowPlaylistContent,
  togglePlay,
  toggleRightbar,
} = songSlice.actions;

export default songSlice.reducer;
