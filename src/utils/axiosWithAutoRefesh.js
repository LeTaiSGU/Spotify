import authorizedAxiosInstance from "./authorizeAxios";
import { store } from "../redux/store";
import { refreshAccessToken, logoutUser } from "~/redux/slice/authSlice";

authorizedAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu bị 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi action Redux để refresh access token
        const resultAction = await store.dispatch(refreshAccessToken());

        if (refreshAccessToken.fulfilled.match(resultAction)) {
          console.log("Access token refreshed. Retrying original request...");

          // Retry lại request cũ (access_token mới đã được backend set vào cookie)
          return authorizedAxiosInstance(originalRequest);
        } else {
          // Nếu refresh fail
          console.log("Failed to refresh access token. Logging out...");
          store.dispatch(logoutUser());
          return Promise.reject(error);
        }
      } catch (err) {
        // Bị lỗi khi gọi refresh
        console.error("Error refreshing access token:", err);
        store.dispatch(logoutUser());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
