import axios from "axios";
import { API_ROOT } from "../utils/constants";

// Tạo playlist mới
export const createPlaylist = async (playlistData = {}) => {
  const defaultData = {
    title: `Playlist mới ${new Date().toLocaleDateString()}`,
    description: "",
    isPublic: true,
  };

  const data = { ...defaultData, ...playlistData };

  try {
    const response = await axios.post(`${API_ROOT}/api/playlists/`, data);
    return response;
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error;
  }
};

// Lấy danh sách playlist của user
export const getUserPlaylists = async (userId) => {
  try {
    const response = await axios.get(
      `${API_ROOT}/api/playlists/user/${userId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    throw error;
  }
};

// Thêm bài hát vào playlist
export const addSongToPlaylist = async (playlistId, songId) => {
  try {
    const response = await axios.post(
      `${API_ROOT}/api/playlist_songs/${playlistId}/add/${songId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    throw error;
  }
};

// Xóa bài hát khỏi playlist
export const removeSongFromPlaylist = async (playlistId, songId) => {
  try {
    const response = await axios.delete(
      `${API_ROOT}/api/playlist_songs/${playlistId}/remove/${songId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    throw error;
  }
};
