import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL cho API
const API_BASE_URL = "http://localhost:8000/api/albums";

// Async action để fetch danh sách album
export const fetchAlbums = createAsyncThunk(
  "album/fetchAlbums",
  async ({ pageNo = 0, pageSize = 10 }, thunkAPI) => {
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
      return res.data.result || res.data;
    } catch (error) {
      console.error(
        "Fetch albums error:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const fetchAlbumById = createAsyncThunk(
  "album/fetchAlbumById",
  async (albumId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${albumId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.result || res.data;
    } catch (error) {
      console.error(
        "Fetch album by ID error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const toggleAlbumStatus = createAsyncThunk(
  "album/updateStatus",
  async (albumId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/${albumId}/delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return { id: albumId, ...res.data };
    } catch (err) {
      console.error(
        "Toggle album status error:",
        err.response?.data || err.message
      );
      return rejectWithValue(err.response?.data || "Update status failed");
    }
  }
);

export const fetchAlbumsSelect = createAsyncThunk(
  "album/fetchAlbumsSelect",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/`, {
        params: {
          status: true,
          sort_by: "title",
          sort_dir: "asc",
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.result || res.data;
    } catch (error) {
      console.error(
        "Fetch albums select error:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
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

export const createAlbum = createAsyncThunk(
  "album/createAlbum",
  async (albumData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Sử dụng đúng tên trường theo model Django
      formData.append("title", albumData.title);
      formData.append("release_date", albumData.releaseDate);

      // Sửa tên trường từ artist sang artist_id
      formData.append("artist_id", albumData.artistId);

      // Thêm description nếu model có yêu cầu
      formData.append("description", albumData.description || "");

      // Model sử dụng avatar thay vì cover_image
      if (albumData.image?.[0]?.originFileObj) {
        const file = albumData.image[0].originFileObj;

        try {
          const compressedImage = await compressImage(file, {
            maxWidthOrHeight: 800,
            maxSizeMB: 0.5,
          });

          const reader = new FileReader();
          const base64Promise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(compressedImage);
          });

          const base64String = await base64Promise;
          formData.append("avatar", base64String); // Thay đổi từ cover_image thành avatar
        } catch (compressionError) {
          console.error("Image compression failed:", compressionError);
          formData.append("avatar", "https://via.placeholder.com/300");
        }
      }

      // In ra log để debug
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const res = await axios.post(`${API_BASE_URL}/create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.result || res.data;
    } catch (err) {
      console.error("Create album error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Create album failed");
    }
  }
);

export const updateAlbum = createAsyncThunk(
  "album/updateAlbum",
  async (albumData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Sử dụng đúng tên trường theo model Django
      formData.append("title", albumData.title);
      formData.append("release_date", albumData.releaseDate);

      // Sửa từ artist thành artist_id
      formData.append("artist_id", albumData.artistId);
      formData.append("description", albumData.description || "");

      if (albumData.image?.[0]?.originFileObj) {
        const file = albumData.image[0].originFileObj;

        try {
          const compressedImage = await compressImage(file, {
            maxWidthOrHeight: 800,
            maxSizeMB: 0.5,
          });

          const reader = new FileReader();
          const base64Promise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(compressedImage);
          });

          const base64String = await base64Promise;
          formData.append("avatar", base64String);
        } catch (compressionError) {
          console.error("Image compression failed:", compressionError);
        }
      }

      // In ra log để debug
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const res = await axios.patch(
        `${API_BASE_URL}/${albumData.id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result || res.data;
    } catch (err) {
      console.error("Update album error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Update album failed");
    }
  }
);

const albumSlice = createSlice({
  name: "album",
  initialState: {
    items: [], // Danh sách album
    albumSelected: {}, // Album đang được chọn để update
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedAlbum: (state) => {
      state.albumSelected = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch albums
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch albums select
      .addCase(fetchAlbumsSelect.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbumsSelect.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchAlbumsSelect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch album by ID
      .addCase(fetchAlbumById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbumById.fulfilled, (state, action) => {
        state.albumSelected = action.payload;
        state.loading = false;
      })
      .addCase(fetchAlbumById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle album status
      .addCase(toggleAlbumStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleAlbumStatus.fulfilled, (state, action) => {
        const updatedId = action.payload.id;

        if (Array.isArray(state.items)) {
          state.items = state.items.filter((album) => album.id !== updatedId);
        } else if (state.items && Array.isArray(state.items.content)) {
          state.items.content = state.items.content.filter(
            (album) => album.id !== updatedId
          );
        }

        state.loading = false;
      })
      .addCase(toggleAlbumStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create album
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        if (Array.isArray(state.items)) {
          state.items.unshift(action.payload);
        } else if (state.items && Array.isArray(state.items.content)) {
          state.items.content.unshift(action.payload);
        }
        state.loading = false;
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update album
      .addCase(updateAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        const updatedAlbum = action.payload;

        if (Array.isArray(state.items)) {
          const index = state.items.findIndex(
            (album) => album.id === updatedAlbum.id
          );
          if (index !== -1) {
            state.items[index] = updatedAlbum;
          }
        } else if (state.items && Array.isArray(state.items.content)) {
          const index = state.items.content.findIndex(
            (album) => album.id === updatedAlbum.id
          );
          if (index !== -1) {
            state.items.content[index] = updatedAlbum;
          }
        }

        state.loading = false;
      })
      .addCase(updateAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedAlbum } = albumSlice.actions;
export const selectItemsAlbum = (state) => state.album.items; // trả về mảng album
export const selectAlbum = (state) => state.album.albumSelected; // trả về album được chọn
export const selectAlbumLoading = (state) => state.album.loading;
export const selectAlbumError = (state) => state.album.error;

export default albumSlice.reducer;
