// import { toast } from 'react-toastify'
import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizeAxios";

//songs
export const getSongHistory = async (userID) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/listening-history/${userID}/`
  );
  return response.data;
};
//playlist
export const createPlaylist = async () => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/playlists/`
  );
  return response.data;
};

export const getPlaylist = async (playlistId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/playlists/${playlistId}`
  );
  return response.data;
};

export const getPlaylistsById = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/playlists/user`
  );
  return response.data;
};

export const getPublicPlaylists = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/playlists/?is_public=true`
  );
  return response.data;
};

export const updatePlaylist = async (playlistId, data) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/playlists/${playlistId}/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deletePlaylist = async (playlistId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/playlists/${playlistId}/`
  );
  return response.data;
};

export const getSongBylistId = async (playlistId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/playlist_songs/${playlistId}`
  );
  return response.data;
};

export const addSongToPlaylist = async (playlistId, songId) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/playlist_songs/${playlistId}/add/${songId}/`
  );
  return response.data;
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/playlist_songs/${playlistId}/remove/${songId}/`
  );
  return response.data;
};

export const addSongToFavorite = async (songId) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/playlists/favorite/add/${songId}/`
  );
  return response.data;
};

// songs
export const getSongById = async (songId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/songs/${songId}`
  );
  return response.data;
};

export const getSongsByAlbumId = async (albumId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/songs/album/${albumId}/`
  );
  return await response.data;
};

// albums
export const getAlbumById = async (albumId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/albums/${albumId}`
  );
  return response.data;
};

export const changePassword = async (userId, data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/users/${userId}/change-password/`,
    data
  );
  return response.data;
};

export const updateUser = async (userId, data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/api/users/${userId}/`,
    data
  );
  return response.data;
};


// artists

export const getTopArtistByUserId= async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/listening-history/top-artists/`
  );
  return response.data;
}


// listening history
export const getHistoryListen = async (userId) => {
  try {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/api/listening-history/${userId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử nghe nhạc:", error);
    throw error;
  }
};

export const addHistoryListen = async (userId, songId) => {
  try {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/api/listening-history/${userId}/`,
      {
        song_id: songId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm lịch sử nghe nhạc:", error);
    throw error;
  }
};