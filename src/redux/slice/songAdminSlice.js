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

// Cải tiến hàm nén ảnh để giảm kích thước file
const compressImage = async (file, options = {}) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Giảm kích thước xuống
        const MAX_WIDTH = options.maxWidthOrHeight || 600; // Giảm xuống từ 800
        const MAX_HEIGHT = options.maxWidthOrHeight || 600; // Giảm xuống từ 800

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

        // Giảm chất lượng xuống 0.6 từ 0.7
        canvas.toBlob(
          (blob) =>
            resolve(new File([blob], file.name, { type: "image/jpeg" })),
          "image/jpeg",
          0.6 // Giảm chất lượng để giảm kích thước
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

// Thêm hàm này vào file songAdminSlice.js
const validateFileSize = (file, maxSizeMB) => {
  const maxSize = maxSizeMB * 1024 * 1024; // chuyển đổi MB thành bytes
  if (file.size > maxSize) {
    return false;
  }
  return true;
};

// Tạo mới bài hát
export const createSong = createAsyncThunk(
  "songAdmin/createSong",
  async (songData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Tạo đối tượng data phù hợp với yêu cầu API
      const songDataObj = {
        song_name: songData.songName,
        album_id: songData.albumId,
        artist_id: songData.artistOwnerId,
        description: songData.description || "No description",
        duration: songData.duration
          ? formatDuration(songData.duration)
          : "00:00:00",
        status: true,
        play_count: 0,
        artists: songData.artists || [],
      };

      // Thêm genre nếu có
      if (songData.genreId) {
        songDataObj.genre = songData.genreId;
      }

      // Thêm MV nếu có
      if (songData.mv) {
        songDataObj.mv = songData.mv;
      }

      // Chuyển đổi đối tượng thành JSON string
      formData.append("data", JSON.stringify(songDataObj));

      // Xử lý file nhạc
      if (songData.fileUpload?.[0]?.originFileObj) {
        try {
          const file = songData.fileUpload[0].originFileObj;

          if (!validateFileSize(file, 10)) {
            return rejectWithValue("File nhạc quá lớn, tối đa 10MB");
          }

          // Thêm file trực tiếp với key "file"
          formData.append("file", file);
        } catch (fileError) {
          console.error("Error processing audio file:", fileError);
          return rejectWithValue("Không thể xử lý file nhạc");
        }
      } else {
        return rejectWithValue("Bài hát cần có file nhạc");
      }

      // Xử lý hình ảnh
      if (songData.image?.[0]?.originFileObj) {
        const file = songData.image[0].originFileObj;

        if (!validateFileSize(file, 2)) {
          return rejectWithValue("Ảnh quá lớn, tối đa 2MB");
        }

        try {
          const compressedImage = await compressImage(file, {
            maxWidthOrHeight: 600,
            maxSizeMB: 0.5,
          });

          // Thêm ảnh với key "img_upload"
          formData.append("img_upload", compressedImage);
        } catch (imgError) {
          console.error("Error processing image:", imgError);
        }
      }

      console.log("Creating song with data:", songDataObj);

      const res = await axios.post(`${API_BASE_URL}/create`, formData, {
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
      return rejectWithValue(
        error.response?.data?.message || "Thêm bài hát thất bại"
      );
    }
  }
);

// Cập nhật bài hát
export const updateSong = createAsyncThunk(
  "songAdmin/updateSong",
  async (songData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Tạo đối tượng data phù hợp với yêu cầu API
      const songDataObj = {
        song_name: songData.songName,
        album: songData.albumId,
        artist_owner: songData.artistOwnerId,
        description: songData.description || "No description",
        artists: songData.artists || [],
      };

      // Thêm duration nếu có
      if (songData.duration) {
        songDataObj.duration = formatDuration(songData.duration);
      }

      // Thêm genre nếu có
      if (songData.genreId) {
        songDataObj.genre = songData.genreId;
      }

      // Thêm MV nếu có
      if (songData.mv) {
        songDataObj.mv = songData.mv;
      }

      // Chuyển đổi đối tượng thành JSON string
      formData.append("data", JSON.stringify(songDataObj));

      // Xử lý file nhạc
      if (songData.fileUpload?.[0]?.originFileObj) {
        try {
          const file = songData.fileUpload[0].originFileObj;

          if (!validateFileSize(file, 10)) {
            return rejectWithValue("File nhạc quá lớn, tối đa 10MB");
          }

          // Thêm file trực tiếp với key "file"
          formData.append("file", file);
        } catch (fileError) {
          console.error("Error processing audio file:", fileError);
        }
      }

      // Xử lý hình ảnh
      if (songData.image?.[0]?.originFileObj) {
        const file = songData.image[0].originFileObj;

        if (!validateFileSize(file, 2)) {
          return rejectWithValue("Ảnh quá lớn, tối đa 2MB");
        }

        try {
          const compressedImage = await compressImage(file, {
            maxWidthOrHeight: 600,
            maxSizeMB: 0.5,
          });

          // Thêm ảnh với key "img_upload"
          formData.append("img_upload", compressedImage);
        } catch (imgError) {
          console.error("Error processing image:", imgError);
        }
      }

      console.log("Updating song with data:", songDataObj);

      const res = await axios.put(
        `${API_BASE_URL}/update/${songData.id}`,
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
      return rejectWithValue(
        error.response?.data?.message || "Cập nhật bài hát thất bại"
      );
    }
  }
);

// Thêm hàm định dạng thời lượng
const formatDuration = (seconds) => {
  if (!seconds) return "00:00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    remainingSeconds.toString().padStart(2, "0"),
  ].join(":");
};

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
