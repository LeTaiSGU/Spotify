import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./slice/songSlice.js";
import { userLibraryReducer } from "./slice/userLibrarySlice";

export const store = configureStore({
  reducer: {
    songs: songReducer,
    userLibrary: userLibraryReducer,
  },
});
