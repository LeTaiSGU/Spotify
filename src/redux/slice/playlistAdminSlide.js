import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";

// Fetch all playlists
const API_BASE_URL = `${API_ROOT}/api/playlists/getall`;
export const fetchPlaylistsAdmin = createAsyncThunk(
  "playlistAdmin/fetchPlaylistsAdmin",
  async ({ pageNo, pageSize } = {}, thunkAPI) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/`, {
        params: {
          page: pageNo,
          size: pageSize,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = res.data.result;
      return {
        ...result,
        content: playlistsWithSongs,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// Fetch playlist by ID
export const fetchPlaylistAdminById = createAsyncThunk(
  "playlistAdmin/fetchPlaylistAdminById",
  async (playlistId, thunkAPI) => {
    try {
      const res = await axios.get(`${API_ROOT}/api/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const playlist = res.data.result;

      try {
        const songsRes = await axios.get(`${API_ROOT}/api/playlists/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        playlist.songs = songsRes.data.result;
      } catch (err) {
        console.error(
          "Failed to fetch songs for playlist",
          playlist.playlistId,
          err
        );
        playlist.songs = [];
      }

      return playlist;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const fetchPlaylistsSelect = createAsyncThunk(
  "playlistAdmin/fetchPlaylistsSelect",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_ROOT}/api/playlists/page`, {
        params: {
          pageNo: 0,
          pageSize: 1000,
          sortBy: "name",
          sortDir: "asc",
          status: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// Create new playlist
export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async (playlistData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append playlistDto as application/json blob
      formData.append(
        "playlistDto",
        new Blob(
          [
            JSON.stringify({
              name: playlistData.name,
              userId: playlistData.userId,
              playlistSongIds: playlistData.songs,
              description: playlistData.description,
              isPrivate: playlistData.isPrivate,
            }),
          ],
          { type: "application/json" }
        )
      );

      // Append cover image
      if (playlistData.coverImage?.[0]?.originFileObj) {
        formData.append("coverImage", playlistData.coverImage[0].originFileObj);
      }

      // Send request
      const res = await axios.post(
        `${API_ROOT}/api/playlists/adminCreate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Trả về kết quả
      console.log("res", res.data);
      return res.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Create failed");
    }
  }
);

export const fetchSongsSelect = createAsyncThunk(
  "songAdmin/fetchSongsSelect",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_ROOT}/api/songs/pageAdmin`, {
        params: {
          pageNo: 0,
          pageSize: 1000,
          sortBy: "songName",
          sortDir: "asc",
          status: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res.data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// Update playlist
export const updatePlaylist = createAsyncThunk(
  "playlistAdmin/updatePlaylist",
  async (playlistData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      // Append playlistDto as application/json blob
      formData.append(
        "playlistUpdateDto",
        new Blob(
          [
            JSON.stringify({
              playlistId: playlistData.playlistId,
              name: playlistData.name,
              userId: playlistData.userId,
              playlistSongIds: playlistData.songs,
              description: playlistData.description,
              isPrivate: playlistData.isPrivate,
            }),
          ],
          { type: "application/json" }
        )
      );
      // Append cover image
      if (playlistData.coverImage?.[0]?.originFileObj) {
        formData.append("coverImage", playlistData.coverImage[0].originFileObj);
      }

      // Send request
      const res = await axios.put(
        `${API_ROOT}/api/playlists/adminUpdate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Trả về kết quả
      return res.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Create failed");
    }
  }
);

// Toggle status
export const togglePlaylistStatus = createAsyncThunk(
  "playlist/togglePlaylistStatus",
  async (playlistId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_ROOT}/api/playlist/status/${playlistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Toggle failed");
    }
  }
);

const playlistAdminSlice = createSlice({
  name: "playlistAdmin",
  initialState: {
    items: [],
    playlistSelected: {},
  },
  reducers: {
    resetPlaylistSelected: (state) => ({ ...state, playlistSelected: {} }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylistsAdmin.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchPlaylistAdminById.fulfilled, (state, action) => {
        state.playlistSelected = action.payload;
      })
      .addCase(fetchPlaylistsSelect.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(togglePlaylistStatus.fulfilled, (state, action) => {
        const updated = action.payload;

        // Cập nhật playlist trong mảng `items`
        const idx = state.items.findIndex(
          (p) => p.playlistId === updated.playlistId
        );
        if (idx !== -1) state.items[idx] = updated;
      });
  },
});
export const selectItemsPlaylistAdmin = (state) => state.playlistAdmin.items;
export const selectPlaylistAdmin = (state) =>
  state.playlistAdmin.playlistSelected;
export default playlistAdminSlice.reducer;
export const { resetPlaylistSelected } = playlistAdminSlice.actions;
