import React, { useEffect } from 'react';
import axios from 'axios';
import { addMonths } from 'date-fns';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

// Hàm lấy CSRF token từ cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const SpotifyPayment = () => {
  const userId = useSelector((state)=>state.auth.user.id); // Lấy ID người dùng từ Redux store
    
  useEffect(() => {

    // Gửi request GET để Django trả về CSRF cookie
    axios.get("http://localhost:8000/api/payments/csrf/", { withCredentials: true });
  }, []);

  const handlePayment = async () => {
   
    try {
      const formData = new FormData();
      formData.append("amount", 99000); // Số tiền thanh toán
      formData.append("orderInfo", "Thanh toán đơn hàng");
  
   
      formData.append("userId", userId); 
      const today = new Date().toISOString().split('T')[0]; 
      formData.append("payDate", today); 
      const response = await axios.post("http://localhost:8000/api/payments/momo/", formData, {
        
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        withCredentials: true,
      });
      console.log("Phản hồi:", response);

      const payUrl = response.data.payUrl;
      if (payUrl) {
        window.location.href = payUrl;
      } else {
        toast.error("Không thể lấy link thanh toán từ server.");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-b from-transparent via-black/50 to-[#004695]">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-lg text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Spotify Premium</h2>
        <div className="text-center mb-6">
          <p className="mb-2">Chào mừng bạn đến với Spotify Premium!</p>
          <p className="mb-4">Chỉ với 99k/tháng, bạn sẽ có trải nghiệm âm nhạc không giới hạn.</p>
        </div>
        <button
          onClick={handlePayment}
          className="w-full py-3 bg-[#1db954] hover:bg-[#1ed760] transition-colors text-white font-bold rounded-lg"
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default SpotifyPayment;

