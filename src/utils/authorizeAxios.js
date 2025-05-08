import axios from "axios";
// import { toast } from 'react-toastify'

// Không cần hàm getCookie() nữa vì sẽ không đọc cookie
// function getCookie(name) {...}

let authorizedAxiosInstance = axios.create({
  withCredentials: true, // BẮT BUỘC để gửi cookie refresh token
});

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// Cấu hình interceptors đơn giản hơn
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Không cần thêm Authorization header thủ công
    // Browser sẽ tự động gửi cookies với mỗi request
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
