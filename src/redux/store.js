import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./slice/songSlice.js";
import { userLibraryReducer } from "./slice/userLibrarySlice";
import authReducer from "./slice/authSlice";

import songAdminReducer from "./slice/songAdminSlice.js";
import albumReducer from "./slice/albumSlice.js";
import artistReducer from "./slice/artistSlice.js";
import playlistAdminSlide from "./slice/playlistAdminSlide.js";
import userAdminReducer from "./slice/userAdminSlice.js";
import searchReducer from "./slice/searchSlice";

export const store = configureStore({
  reducer: {
    songs: songReducer,
    userLibrary: userLibraryReducer,
    auth: authReducer,
    songAdmin: songAdminReducer,
    album: albumReducer,
    artist: artistReducer,
    playlistAdmin: playlistAdminSlide,
    userAdmin: userAdminReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
