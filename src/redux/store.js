import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage"; // Sử dụng localStorage
import songReducer from "./slice/songSlice.js";
import { userLibraryReducer } from "./slice/userLibrarySlice";
import authReducer from "./slice/authSlice";

import songAdminReducer from "./slice/songAdminSlice.js";
import albumReducer from "./slice/albumSlice.js";
import artistReducer from "./slice/artistSlice.js";
import playlistAdminSlide from "./slice/playlistAdminSlide.js";
import userAdminReducer from "./slice/userAdminSlice.js";
import searchReducer from "./slice/searchSlice";

const persistConfig = {
  key: "root", // Key để lưu trữ trong localStorage
  storage, // Sử dụng localStorage
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"], // Chỉ lưu `user`, không lưu token nếu bạn có (nhưng đã dùng cookie thì không cần token ở đây)
};

const rootReducer = combineReducers({
  songs: songReducer,
  userLibrary: userLibraryReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  songAdmin: songAdminReducer,
  album: albumReducer,
  artist: artistReducer,
  playlistAdmin: playlistAdminSlide,
  userAdmin: userAdminReducer,
  search: searchReducer,
});
// Tạo persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Bỏ qua kiểm tra tuần tự hóa cho Redux Persist
    }),
});
export const persistor = persistStore(store);
persistor.purge(); // Gọi lần đầu để xóa dữ liệu cũ
