// src/features/songSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  song: {
    id: 1,
    title: "Song Title",
    artist1: "Le Tai",
    artist2: ["Hieu phan", "Chi bao", "Truong hiep"],
  },
};

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    setSong: (state, action) => {
      state.song = action.payload;
    },
  },
});

export const { setSong } = songSlice.actions;
export default songSlice.reducer;
