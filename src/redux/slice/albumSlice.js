import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action để fetch danh sách album
export const fetchAlbums = createAsyncThunk(
  "album/fetchAlbums",
  async ({ pageNo = 0, pageSize = 10 }, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/album/all?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result; // <-- chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
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
      const res = await axios.get(
        `http://localhost:8080/api/album/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.result; // <-- chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const toggleAlbumStatus = createAsyncThunk(
  "album/updateStatus",
  async (albumId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/album/status/${albumId}`,
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

export const fetchAlbumsSelect = createAsyncThunk(
  "album/fetchAlbumsSelect",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:8080/api/album/allstatus", {
        params: {
          pageNo: 0,
          pageSize: 1000,
          sortBy: "title",
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

export const createAlbum = createAsyncThunk(
  "album/createAlbum",
  async (albumData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(
        "albumRequestDTO",
        new Blob(
          [
            JSON.stringify({
              title: albumData.title,
              releaseDate: albumData.releaseDate,
              artistId: albumData.artistId,
              type: albumData.type,
            }),
          ],
          { type: "application/json" }
        )
      );
      if (albumData.image && albumData.image[0]) {
        formData.append("coverImage", albumData.image[0].originFileObj);
      }

      const res = await axios.post(
        "http://localhost:8080/api/album/create",
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
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateAlbum = createAsyncThunk(
  "album/updateAlbum",
  async (albumData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(
        "albumUpdateDTO",
        new Blob(
          [
            JSON.stringify({
              albumId: albumData.albumId,
              title: albumData.title,
              releaseDate: albumData.releaseDate,
              artistId: albumData.artistId,
              type: albumData.type,
            }),
          ],
          { type: "application/json" }
        )
      );
      if (albumData.image && albumData.image[0]) {
        formData.append("coverImage", albumData.image[0].originFileObj);
      }

      const res = await axios.put(
        "http://localhost:8080/api/album/update",
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
      return rejectWithValue(err.response.data);
    }
  }
);

const albumSlice = createSlice({
  name: "album",
  initialState: {
    items: { content: [] }, // Danh sách có phân trang
    albumSelected: {}, // Album đang được chọn để update
  },
  reducers: {
    // Nếu có thêm action khác như add/update/delete thì viết ở đây
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchAlbumsSelect.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchAlbumById.fulfilled, (state, action) => {
        state.albumSelected = action.payload;
      })
      .addCase(toggleAlbumStatus.fulfilled, (state, action) => {
        const updatedAlbum = action.payload;

        const index = state.items.content.findIndex(
          (item) => item.albumId === updatedAlbum.albumId
        );
        if (index !== -1) {
          state.items.content[index] = updatedAlbum;
        }
      });
  },
});

export const selectItemsAlbum = (state) => state.album.items; // trả về mảng album
export const selectAlbum = (state) => state.album.albumSelected; // trả về album được chọn
export default albumSlice.reducer;
