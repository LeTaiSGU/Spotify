import axios from 'axios'
// import { toast } from 'react-toastify'

let authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình interceptors
// can thiệp vào các req
authorizedAxiosInstance.interceptors.request.use((config) => {

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

export default authorizedAxiosInstance