import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL cho API
const API_BASE_URL = "http://localhost:8000/api/songs";

// Fetch danh sách song
export const fetchSongsAdmin = createAsyncThunk(
  "songAdmin/fetchSongsAdmin",
  async ({ pageNo = 0, pageSize = 10 } = {}, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/`, // Thay đổi endpoint
        {
          params: {
            page: pageNo, // Đổi từ pageNo sang page phù hợp với Django
            size: pageSize, // Đổi từ pageSize sang size
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result || res.data; // Hỗ trợ cả hai dạng response
    } catch (error) {
      console.error(
        "Fetch songs error:",
        error.response?.data || error.message
      );
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
      const res = await axios.get(`${API_BASE_URL}/${songId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.result || res.data;
    } catch (error) {
      console.error(
        "Fetch song by ID error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

// Fetch tất cả bài hát dùng cho select
export const fetchSongsSelect = createAsyncThunk(
  "songAdmin/fetchSongsSelect",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/`, {
        params: {
          status: true,
          sort_by: "song_name", // Đổi sang đúng cú pháp của Django
          sort_dir: "asc",
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.result || res.data;
    } catch (error) {
      console.error(
        "Fetch songs select error:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// Toggle status bài hát
export const toggleSongStatus = createAsyncThunk(
  "songAdmin/toggleSongStatus",
  async (songId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/${songId}/delete/`, // Cập nhật endpoint theo Django pattern
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { id: songId, ...res.data };
    } catch (err) {
      console.error(
        "Toggle song status error:",
        err.response?.data || err.message
      );
      return rejectWithValue(err.response?.data?.message || "Toggle failed");
    }
  }
);

// Nén ảnh trước khi chuyển sang base64
const compressImage = async (file, options = {}) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = options.maxWidthOrHeight || 800;
        const MAX_HEIGHT = options.maxWidthOrHeight || 800;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = height * (MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = width * (MAX_HEIGHT / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) =>
            resolve(new File([blob], file.name, { type: "image/jpeg" })),
          "image/jpeg",
          0.7
        );
      };
    };
  });
};

// Chuyển File thành base64 string
const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Tạo mới bài hát
export const createSong = createAsyncThunk(
  "songAdmin/createSong",
  async (songData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Thêm các trường cơ bản
      formData.append("song_name", songData.songName);
      formData.append("album", songData.albumId);
      formData.append("artist_owner", songData.artistOwnerId);
      formData.append("description", songData.description || "");

      // Thêm genre nếu có
      if (songData.genreId) {
        formData.append("genre", songData.genreId);
      }

      // Xử lý duration (thời lượng)
      if (songData.duration) {
        formData.append("duration", songData.duration);
      }

      // Xử lý MV nếu có
      if (songData.mv) {
        formData.append("mv", songData.mv);
      }

      // Xử lý file nhạc
      if (songData.fileUpload?.[0]?.originFileObj) {
        try {
          const file = songData.fileUpload[0].originFileObj;
          const base64File = await fileToBase64(file);
          formData.append("file_upload", base64File);
        } catch (fileError) {
          console.error("Error processing audio file:", fileError);
          // Tiếp tục tạo song mà không có file nếu lỗi
        }
      }

      // Xử lý hình ảnh
      if (songData.image?.[0]?.originFileObj) {
        const file = songData.image[0].originFileObj;
        try {
          const compressedImage = await compressImage(file, {
            maxWidthOrHeight: 800,
            maxSizeMB: 0.5,
          });

          const base64Image = await fileToBase64(compressedImage);
          formData.append("img", base64Image);
        } catch (imgError) {
          console.error("Error processing image:", imgError);
          // Tiếp tục tạo song mà không có hình ảnh nếu lỗi
          formData.append("img", "https://via.placeholder.com/300");
        }
      }

      // Xử lý nghệ sĩ tham gia (featured artists)
      if (Array.isArray(songData.artists) && songData.artists.length > 0) {
        // Django REST thường xử lý mảng ID dưới dạng nhiều trường cùng tên
        songData.artists.forEach((artistId) => {
          formData.append("artists", artistId);
        });
      }

      console.log("Creating song with data:", Object.fromEntries(formData));

      const res = await axios.post(`${API_BASE_URL}/create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res.data.result || res.data;
    } catch (error) {
      console.error(
        "Create song error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Create song failed");
    }
  }
);

// Cập nhật bài hát
export const updateSong = createAsyncThunk(
  "songAdmin/updateSong",
  async (songData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Thêm các trường cơ bản
      formData.append("song_name", songData.songName);
      formData.append("album", songData.albumId);
      formData.append("artist_owner", songData.artistOwnerId);
      formData.append("description", songData.description || "");

      // Thêm genre nếu có
      if (songData.genreId) {
        formData.append("genre", songData.genreId);
      }

      // Xử lý duration (thời lượng) nếu có
      if (songData.duration) {
        formData.append("duration", songData.duration);
      }

      // Xử lý MV nếu có
      if (songData.mv) {
        formData.append("mv", songData.mv);
      }

      // Xử lý file nhạc
      if (songData.fileUpload?.[0]?.originFileObj) {
        try {
          const file = songData.fileUpload[0].originFileObj;
          const base64File = await fileToBase64(file);
          formData.append("file_upload", base64File);
        } catch (fileError) {
          console.error("Error processing audio file:", fileError);
          // Không cập nhật file nếu xử lý lỗi
        }
      }

      // Xử lý hình ảnh
      if (songData.image?.[0]?.originFileObj) {
        const file = songData.image[0].originFileObj;
        try {
          const compressedImage = await compressImage(file, {
            maxWidthOrHeight: 800,
            maxSizeMB: 0.5,
          });

          const base64Image = await fileToBase64(compressedImage);
          formData.append("img", base64Image);
        } catch (imgError) {
          console.error("Error processing image:", imgError);
          // Không cập nhật ảnh nếu xử lý lỗi
        }
      }

      // Xử lý nghệ sĩ tham gia (featured artists)
      if (Array.isArray(songData.artists) && songData.artists.length > 0) {
        // Django REST thường xử lý mảng ID dưới dạng nhiều trường cùng tên
        songData.artists.forEach((artistId) => {
          formData.append("artists", artistId);
        });
      }

      console.log("Updating song with data:", Object.fromEntries(formData));

      const res = await axios.patch(
        `${API_BASE_URL}/${songData.id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return res.data.result || res.data;
    } catch (error) {
      console.error(
        "Update song error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Update song failed");
    }
  }
);

const songAdminSlice = createSlice({
  name: "songAdmin",
  initialState: {
    items: [],
    songSelected: {},
    loading: false,
    error: null,
  },
  reducers: {
    resetSongSelected: (state) => {
      state.songSelected = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch songs
      .addCase(fetchSongsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongsAdmin.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchSongsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch songs select
      .addCase(fetchSongsSelect.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongsSelect.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchSongsSelect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch song by id
      .addCase(fetchSongAdminById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongAdminById.fulfilled, (state, action) => {
        state.songSelected = action.payload;
        state.loading = false;
      })
      .addCase(fetchSongAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle song status
      .addCase(toggleSongStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSongStatus.fulfilled, (state, action) => {
        const updatedId = action.payload.id;

        if (Array.isArray(state.items)) {
          state.items = state.items.filter((song) => song.id !== updatedId);
        } else if (state.items && Array.isArray(state.items.content)) {
          state.items.content = state.items.content.filter(
            (song) => song.id !== updatedId
          );
        }

        state.loading = false;
      })
      .addCase(toggleSongStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create song
      .addCase(createSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSong.fulfilled, (state, action) => {
        if (Array.isArray(state.items)) {
          state.items.unshift(action.payload);
        } else if (state.items && Array.isArray(state.items.content)) {
          state.items.content.unshift(action.payload);
        }
        state.loading = false;
      })
      .addCase(createSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update song
      .addCase(updateSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSong.fulfilled, (state, action) => {
        const updatedSong = action.payload;

        if (Array.isArray(state.items)) {
          const index = state.items.findIndex(
            (song) => song.id === updatedSong.id
          );
          if (index !== -1) {
            state.items[index] = updatedSong;
          }
        } else if (state.items && Array.isArray(state.items.content)) {
          const index = state.items.content.findIndex(
            (song) => song.id === updatedSong.id
          );
          if (index !== -1) {
            state.items.content[index] = updatedSong;
          }
        }

        state.loading = false;
        state.songSelected = updatedSong; // Cập nhật song được chọn
      })
      .addCase(updateSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSongSelected } = songAdminSlice.actions;
export const selectItemsSongAdmin = (state) => state.songAdmin.items || [];
export const selectSongAdmin = (state) => state.songAdmin.songSelected || {};
export const selectSongLoading = (state) => state.songAdmin.loading;
export const selectSongError = (state) => state.songAdmin.error;
export default songAdminSlice.reducer;
