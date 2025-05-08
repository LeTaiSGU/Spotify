import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { RESET_APP } from "../store";

// Gọi /me/ để lấy lại user từ cookie
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/api/users/me/`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Truyền thẳng lỗi 401 lên để interceptor xử lý
        throw error;
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Trong authSlice.js
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      // Thêm API_ROOT vào URL
      const response = await axios.post(
        `${API_ROOT}/api/users/token/refresh/`,
        {},
        {
          withCredentials: true, // Để gửi cookies
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to refresh token"
      );
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_ROOT}/api/users/login/`,
        { email, password },
        { withCredentials: true }
      );
      return { user: res.data.user };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Đăng nhập thất bại");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_ROOT}/api/users/logout/`,
        {},
        { withCredentials: true }
      );
      localStorage.clear();
      return true;
    } catch (err) {
      return rejectWithValue("Đăng xuất thất bại");
    }
  }
);

// Register
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
      return rejectWithValue("Đăng ký thất bại");
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null; // Token hết hạn thì clear user
      })

      // Refresh access token
      .addCase(refreshAccessToken.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.loading = false;
        state.user = null; // Refresh token thất bại thì clear user
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
