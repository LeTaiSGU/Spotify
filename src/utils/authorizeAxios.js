import axios from "axios";
// import { toast } from 'react-toastify'

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

let authorizedAxiosInstance = axios.create({
  withCredentials: true, // BẮT BUỘC để gửi cookie refresh token
});

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// Cấu hình interceptors
// can thiệp vào các req
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
