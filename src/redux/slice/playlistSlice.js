import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ROOT } from "../../utils/constants";

// Thunks
export const fetchUserPlaylists = createAsyncThunk(
  "playlist/fetchUserPlaylists",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_ROOT}/api/playlists/user/${userId}/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Không thể tải danh sách playlist"
      );
    }
  }
);

export const fetchPlaylistById = createAsyncThunk(
  "playlist/fetchPlaylistById",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_ROOT}/api/playlists/${playlistId}/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Không thể tải thông tin playlist"
      );
    }
  }
);

export const createNewPlaylist = createAsyncThunk(
  "playlist/createNewPlaylist",
  async (playlistData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_ROOT}/api/playlists/`,
        playlistData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Không thể tạo playlist mới"
      );
    }
  }
);

export const addSongToPlaylist = createAsyncThunk(
  "playlist/addSongToPlaylist",
  async ({ playlistId, songId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_ROOT}/api/playlist_songs/${playlistId}/add/${songId}/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Không thể thêm bài hát vào playlist"
      );
    }
  }
);

export const removeSongFromPlaylist = createAsyncThunk(
  "playlist/removeSongFromPlaylist",
  async ({ playlistId, songId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_ROOT}/api/playlist_songs/${playlistId}/remove/${songId}/`
      );
      return { playlistId, songId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Không thể xóa bài hát khỏi playlist"
      );
    }
  }
);

// Initial state
const initialState = {
  userPlaylists: [],
  currentPlaylist: null,
  loading: false,
  error: null,
  modalVisible: false,
  selectedSongForPlaylist: null,
};

// Slice
const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    // Hiển thị modal thêm bài hát vào playlist
    showPlaylistModal: (state, action) => {
      state.modalVisible = true;
      state.selectedSongForPlaylist = action.payload;
    },

    // Ẩn modal thêm bài hát vào playlist
    hidePlaylistModal: (state) => {
      state.modalVisible = false;
      state.selectedSongForPlaylist = null;
    },

    // Xóa thông báo lỗi
    clearError: (state) => {
      state.error = null;
    },

    // Reset trạng thái của playlist hiện tại
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user playlists
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.userPlaylists = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch playlist by ID
      .addCase(fetchPlaylistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistById.fulfilled, (state, action) => {
        state.currentPlaylist = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlaylistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create new playlist
      .addCase(createNewPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewPlaylist.fulfilled, (state, action) => {
        state.userPlaylists.push(action.payload);
        state.loading = false;
      })
      .addCase(createNewPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add song to playlist
      .addCase(addSongToPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSongToPlaylist.fulfilled, (state, action) => {
        // Nếu đang ở playlist được thêm bài hát, cập nhật lại playlist hiện tại
        if (
          state.currentPlaylist &&
          state.currentPlaylist.id === action.payload.playlist_id
        ) {
          // Thêm bài hát vào songs nếu API trả về chi tiết bài hát
          if (action.payload.song) {
            state.currentPlaylist.songs = [
              ...(state.currentPlaylist.songs || []),
              action.payload.song,
            ];
          }
        }
        state.loading = false;
        state.modalVisible = false; // Đóng modal sau khi thêm thành công
      })
      .addCase(addSongToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove song from playlist
      .addCase(removeSongFromPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSongFromPlaylist.fulfilled, (state, action) => {
        // Nếu đang ở playlist bị xóa bài hát, cập nhật lại playlist hiện tại
        if (
          state.currentPlaylist &&
          state.currentPlaylist.id === action.payload.playlistId
        ) {
          state.currentPlaylist.songs = state.currentPlaylist.songs.filter(
            (song) => song.id !== action.payload.songId
          );
        }
        state.loading = false;
      })
      .addCase(removeSongFromPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  showPlaylistModal,
  hidePlaylistModal,
  clearError,
  clearCurrentPlaylist,
} = playlistSlice.actions;

// Selectors
export const selectUserPlaylists = (state) => state.playlist.userPlaylists;
export const selectCurrentPlaylist = (state) => state.playlist.currentPlaylist;
export const selectPlaylistLoading = (state) => state.playlist.loading;
export const selectPlaylistError = (state) => state.playlist.error;
export const selectPlaylistModalVisible = (state) =>
  state.playlist.modalVisible;
export const selectSelectedSongForPlaylist = (state) =>
  state.playlist.selectedSongForPlaylist;

export default playlistSlice.reducer;
