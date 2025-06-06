import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";

const compressImage = async (file, options = {}) => {
  // Đây là một giải pháp đơn giản mà không cần thư viện ngoài
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

        // Tính toán tỷ lệ để giữ nguyên tỷ lệ khung hình
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

        // Điều chỉnh quality ở đây (0.7 = 70% chất lượng, giảm kích thước)
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
// Định nghĩa base URL cho API
const API_BASE_URL = `${API_ROOT}/api/artists`;

// Fetch tất cả nghệ sĩ
export const fetchArtists = createAsyncThunk(
  "artist/fetchArtists",
  async ({ pageNo, pageSize } = {}, thunkAPI) => {
    try {
      // GET /api/artists/
      const res = await axios.get(`${API_BASE_URL}/`, {
        params: {
          page: pageNo,
          size: pageSize,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.result || res.data; // Hỗ trợ cả hai format response
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// Fetch nghệ sĩ theo ID
export const fetchArtistById = createAsyncThunk(
  "artist/fetchArtistById",
  async (artistId, { rejectWithValue }) => {
    try {
      // GET /api/artists/<artist_id>/
      const res = await axios.get(`${API_BASE_URL}/${artistId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.result || res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

// Fetch danh sách nghệ sĩ chọn lọc
export const fetchArtistsSelect = createAsyncThunk(
  "artist/fetchArtistsSelect",
  async (_, thunkAPI) => {
    try {
      // GET /api/artists/ (với params để filter)
      const res = await axios.get(`${API_BASE_URL}/`, {
        params: {
          status: true,
          sort_by: "name",
          sort_dir: "asc",
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data.result || res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// Create artist
export const createArtist = createAsyncThunk(
  "artist/createArtist",
  async (values, thunkAPI) => {
    const formData = new FormData();

    // Append các trường thông tin khác vào formData
    formData.append("name", values.name);
    formData.append("bio", values.bio); // Nếu có bio
    formData.append("genre", values.genre); // Ví dụ thêm genre

    // Nếu có ảnh thì append vào FormData
    if (values.image?.[0]?.originFileObj) {
      formData.append("img_upload", values.image[0].originFileObj);
    }

    try {
      // Gửi request POST
      const res = await axios.post(`${API_BASE_URL}/create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data; // Dữ liệu trả về sau khi tạo thành công
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create failed"
      );
    }
  }
);

// Cập nhật thông tin nghệ sĩ
export const updateArtist = createAsyncThunk(
  "artist/updateArtist",
  async (artistData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("name", artistData.name);
      formData.append("description", artistData.description);

      // Xử lý ảnh tương tự như trong createArtist
      if (artistData.image?.[0]?.originFileObj) {
        const file = artistData.image[0].originFileObj;

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
          // Giữ nguyên avatar cũ nếu nén thất bại
          if (artistData.avatar) {
            formData.append("avatar", artistData.avatar);
          }
        }
      }

      // Rest remains the same
      const res = await axios.put(
        `${API_BASE_URL}/${artistData.id}/update/`,
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
        "Update artist error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Update artist failed"
      );
    }
  }
);

// Cập nhật trạng thái của nghệ sĩ (active/inactive)
export const toggleArtistStatus = createAsyncThunk(
  "artist/updateStatus",
  async (artistId, { rejectWithValue }) => {
    try {
      // DELETE /api/artists/<artist_id>/delete/ (để đổi status)
      const res = await axios.delete(`${API_BASE_URL}/${artistId}/delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return { id: artistId, ...res.data }; // Trả về id thay vì artistId
    } catch (error) {
      console.error(
        "Delete artist error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Delete artist failed"
      );
    }
  }
);

const artistSlice = createSlice({
  name: "artist",
  initialState: {
    items: [], // Danh sách nghệ sĩ
    artistSelected: {}, // Nghệ sĩ đang được chọn
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedArtist: (state) => {
      state.artistSelected = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all artists
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Fetch all artists for selection
      .addCase(fetchArtistsSelect.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Fetch artist by ID
      .addCase(fetchArtistById.fulfilled, (state, action) => {
        state.artistSelected = action.payload;
      })
      // Update artist status
      .addCase(toggleArtistStatus.fulfilled, (state, action) => {
        const updatedArtist = action.payload;

        // Cập nhật artist trong mảng `items`
        const index = state.items.findIndex(
          (item) => item.artistId === updatedArtist.id
        );
        if (index !== -1) {
          state.items[index] = updatedArtist;
        }
      });
  },
});
export const { clearSelectedArtist } = artistSlice.actions;
export const selectItemsArtist = (state) => {
  return state.artist.items; // Trả về danh sách nghệ sĩ
};
export const selectArtist = (state) => {
  return state.artist.artistSelected; // Trả về nghệ sĩ được chọn
};

export default artistSlice.reducer;
