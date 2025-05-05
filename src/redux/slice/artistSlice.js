import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch tất cả nghệ sĩ
export const fetchArtists = createAsyncThunk(
  "artist/fetchArtists",
  async ({ pageNo, pageSize } = {}, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/artist/all?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result; // Chỉ lấy phần `result` trong ApiResponse
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
      const res = await axios.get(
        `http://localhost:8080/api/artist/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result; // Chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

// Fetch danh sách nghệ sĩ chọn lọc (chỉ lấy nghệ sĩ có trạng thái active)
export const fetchArtistsSelect = createAsyncThunk(
  "artist/fetchArtistsSelect",
  async (thunkAPI) => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/artist/allstatus",
        {
          params: {
            pageNo: 0,
            pageSize: 1000, // Để lấy tất cả
            sortBy: "name",
            sortDir: "asc",
            status: true, // Hoặc false tùy bạn muốn lấy active hay đã bị disable
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result; // Chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// Tạo mới một nghệ sĩ
export const createArtist = createAsyncThunk(
  "artist/createArtist",
  async (artistData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(
        "artistRequestDTO",
        new Blob(
          [
            JSON.stringify({
              name: artistData.name,
              description: artistData.description,
            }),
          ],
          { type: "application/json" }
        )
      );
      // Kiểm tra xem image có tồn tại không và append vào formData
      formData.append("img", artistData.image[0].originFileObj);

      const res = await axios.post(
        "http://localhost:8080/api/artist/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result; // Chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

// Cập nhật thông tin nghệ sĩ
export const updateArtist = createAsyncThunk(
  "artist/updateArtist",
  async (artistData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(
        "artistRequestDTO",
        new Blob(
          [
            JSON.stringify({
              artistId: artistData.artistId,
              name: artistData.name,
              description: artistData.description,
            }),
          ],
          { type: "application/json" }
        )
      );
      formData.append("img", artistData.image[0].originFileObj);

      const res = await axios.put(
        `http://localhost:8080/api/artist/${artistData.artistId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result; // Chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

// Cập nhật trạng thái của nghệ sĩ (active/inactive)
export const toggleArtistStatus = createAsyncThunk(
  "artist/updateStatus",
  async (artistId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/artist/status/${artistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const artistSlice = createSlice({
  name: "artist",
  initialState: {
    items: [], // Danh sách nghệ sĩ
    artistSelected: {}, // Nghệ sĩ đang được chọn
  },
  reducers: {},
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
          (item) => item.artistId === updatedArtist.artistId
        );
        if (index !== -1) {
          state.items[index] = updatedArtist;
        }
      });
  },
});

export const selectItemsArtist = (state) => {
  return state.artist.items; // Trả về danh sách nghệ sĩ
};
export const selectArtist = (state) => {
  return state.artist.artistSelected; // Trả về nghệ sĩ được chọn
};

export default artistSlice.reducer;
