import axios from "axios";
import { API_ROOT } from "../utils/constants";

export const getHistoryListen = async (userId) => {
  try {
    const response = await axios.get(
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
    const response = await axios.post(
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
