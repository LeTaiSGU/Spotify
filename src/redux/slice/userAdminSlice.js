import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch danh sách user dùng cho select (status = true)
export const fetchUsersSelect = createAsyncThunk(
  "userAdmin/fetchUsersSelect",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:8080/api/user/status", {
        params: {
          status: true,
          pageNo: 0,
          pageSize: 100, // hoặc số tùy chọn
          sortBy: "userName",
          sortDir: "asc",
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Trả về content nằm trong result
      return res.data.result; // ⬅️ lấy mảng user từ page
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

const userAdminSlice = createSlice({
  name: "userAdmin",
  initialState: {
    items: [],
    userSelected: {},
  },
  reducers: {
    resetUserSelected: (state) => {
      state.userSelected = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersSelect.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { resetUserSelected } = userAdminSlice.actions;
export default userAdminSlice.reducer;

// Selectors
export const selectItemsUserAdmin = (state) => state.userAdmin.items || [];
export const selectUserAdminSelected = (state) =>
  state.userAdmin.userSelected || {};
