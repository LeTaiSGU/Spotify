import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";

// Đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_ROOT}/api/users/login/`,
        { email, password },
        { withCredentials: true }
      );
      // Nếu backend trả về access token trong body
      if (res.data.access) {
        document.cookie = `access_token=${res.data.access}; path=/; max-age=3600; secure; samesite=strict`;
      }
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return { user: res.data.user, access: res.data.access || null };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Đăng nhập thất bại");
    }
  }
);

// Đăng xuất
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await fetch(`${API_ROOT}/api/users/logout/`, {
        method: "POST",
        credentials: "include",
      });
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Đăng xuất thất bại");
    }
  }
);

// Đăng ký
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_ROOT}/api/users/register/`,
        userData,
        { withCredentials: true }
      );
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Đăng ký thất bại");
    }
  }
);

// Refresh access token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_ROOT}/api/users/token/refresh/`,
        {},
        { withCredentials: true }
      );
      document.cookie = `access_token=${res.data.access}; path=/; max-age=3600; secure; samesite=strict`;
      return res.data.access;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Refresh token hết hạn hoặc không hợp lệ"
      );
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.access = action.payload.access;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.access = null;
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Refresh
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.access = action.payload;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
