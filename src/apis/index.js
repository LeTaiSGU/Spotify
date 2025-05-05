// import { toast } from 'react-toastify'
import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizeAxios'


//playlist
export const createPlaylist = async () => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/playlists/`)
  return response.data
}

export const getPlaylist = async (playlistId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/playlists/${playlistId}`)
  return response.data
}

export const updatePlaylist = async (playlistId, data) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/playlists/${playlistId}/`, 
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return response.data
}

export const deletePlaylist = async (playlistId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/playlists/${playlistId}/`)
  return response.data
}

export const getSongBylistId = async (playlistId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/playlist_songs/${playlistId}`)
  return response.data
}

export const addSongToPlaylist = async (playlistId, songId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/playlist_songs/${playlistId}/add/${ songId }`)
  return response.data
}

// songs 
export const getSongById = async (songId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/songs/${songId}`)
  return response.data
}

export const getSongsByAlbumId = async (albumId) => {
  const response = await fetch(`/api/album/${albumId}/songs`);
  return await response.json();
};


// albums
export const getAlbumById = async (albumId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/albums/${albumId}`)
  return response.data
}



