// import { toast } from 'react-toastify'
import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizeAxios'


export const createPlaylist = async () => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/playlists/`)
  return response.data
}