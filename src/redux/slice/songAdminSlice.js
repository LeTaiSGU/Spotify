import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch danh sách song
export const fetchSongsAdmin = createAsyncThunk(
  "songAdmin/fetchSongsAdmin",
  async ({ pageNo, pageSize } = {}, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/songs/pageAdmin?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// Fetch song theo ID
export const fetchSongAdminById = createAsyncThunk(
  "songAdmin/fetchSongAdminById",
  async (songId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/songs/${songId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

// Fetch tất cả bài hát dùng cho select
export const fetchSongsSelect = createAsyncThunk(
  "songAdmin/fetchSongsSelect",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:8080/api/songs/pageAdmin", {
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

// Tạo mới song
export const createSong = createAsyncThunk(
  "songAdmin/createSong",
  async (songData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(
        "song",
        new Blob(
          [
            JSON.stringify({
              songName: songData.songName,
              releaseDate: songData.releaseDate,
              artistId: songData.artistId,
              albumId: songData.albumId,
              duration: songData.duration,
              featuredArtistIds: songData.featuredArtists,
            }),
          ],
          { type: "application/json" }
        )
      );

      if (songData.audio?.[0]?.originFileObj) {
        formData.append("songFile", songData.audio[0].originFileObj);
      }
      if (songData.image?.[0]?.originFileObj) {
        formData.append("imgFile", songData.image[0].originFileObj);
      }

      const res = await axios.post(
        "http://localhost:8080/api/songs/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

// Cập nhật song
export const updateSong = createAsyncThunk(
  "songAdmin/updateSong",
  async (songData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(
        "song",
        new Blob(
          [
            JSON.stringify({
              songId: songData.songId,
              songName: songData.songName,
              releaseDate: songData.releaseDate,
              artist_id: songData.artistId,
              album_id: songData.albumId,
              duration: songData.duration,
              featuredArtistIds: songData.featuredArtists,
            }),
          ],
          { type: "application/json" }
        )
      );

      if (songData.audio?.[0]?.originFileObj) {
        formData.append("songFile", songData.audio[0].originFileObj);
      }
      if (songData.image?.[0]?.originFileObj) {
        formData.append("imgFile", songData.image[0].originFileObj);
      }

      const res = await axios.put(
        `http://localhost:8080/api/songs/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// Toggle status bài hát
export const toggleSongStatus = createAsyncThunk(
  "songAdmin/toggleSongStatus",
  async (songId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/songs/status/${songId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Toggle failed");
    }
  }
);

const songAdminSlice = createSlice({
  name: "songAdmin",
  initialState: {
    items: [],
    songSelected: {},
  },
  reducers: {
    resetSongSelected: (state) => {
      state.songSelected = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongsAdmin.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchSongsSelect.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchSongAdminById.fulfilled, (state, action) => {
        state.songSelected = action.payload;
      })
      .addCase(toggleSongStatus.fulfilled, (state, action) => {
        const updated = action.payload;

        if (Array.isArray(state.items.content)) {
          const idx = state.items.content.findIndex(
            (s) => s.songId === updated.songId
          );
          if (idx !== -1) state.items.content[idx] = updated;
        }

        if (Array.isArray(state.items)) {
          const idx = state.items.findIndex((s) => s.songId === updated.songId);
          if (idx !== -1) state.items[idx] = updated;
        }
      });
  },
});

export const { resetSongSelected } = songAdminSlice.actions;
export const selectItemsSongAdmin = (state) => state.songAdmin.items || [];
export const selectSongAdmin = (state) => state.songAdmin.songSelected || {};
export default songAdminSlice.reducer;
