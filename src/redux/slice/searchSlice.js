import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

console.log("searchSlice.js loaded");

// Thunk để gọi API tìm kiếm - sử dụng endpoint search_all
export const searchContent = createAsyncThunk(
  "search/searchContent",
  async (query, { rejectWithValue }) => {
    console.log("searchContent thunk called with query:", query);
    try {
      console.log("Calling search API...");

      // Gọi API tìm kiếm tất cả trong một request
      const response = await axios.get(
        `http://localhost:8000/api/search/?q=${encodeURIComponent(query)}`
      );
      console.log("Search API response:", response.data);

      const result = {
        songs: response.data.songs || [],
        albums: response.data.albums || [],
        artists: response.data.artists || [],
        query: query,
      };

      console.log("Search completed, returning result:", result);
      return result;
    } catch (error) {
      console.error("Search error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: {
      songs: [],
      albums: [],
      artists: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      console.log("setSearchQuery reducer called with:", action.payload);
      state.query = action.payload;
    },
    clearSearchResults: (state) => {
      console.log("clearSearchResults reducer called");
      state.results = { songs: [], albums: [], artists: [] };
      state.query = "";
    },
    setSearchLoading: (state, action) => {
      console.log("setSearchLoading reducer called with:", action.payload);
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchContent.pending, (state) => {
        console.log("searchContent.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        console.log("searchContent.fulfilled with payload:", action.payload);
        state.loading = false;
        state.results = {
          songs: action.payload.songs,
          albums: action.payload.albums,
          artists: action.payload.artists,
        };
        state.query = action.payload.query;
      })
      .addCase(searchContent.rejected, (state, action) => {
        console.log("searchContent.rejected with error:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, clearSearchResults, setSearchLoading } =
  searchSlice.actions;

export default searchSlice.reducer;
