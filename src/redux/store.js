import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./slice/songSlice.js";

export const store = configureStore({
  reducer: {
    song: songReducer,
  },
});
