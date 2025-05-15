import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


const PaymentSuccess = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen layout">
      <h1 className="text-4xl font-bold text-green-500 mb-4">🎉 Thanh toán thành công!</h1>
      <p className="text-lg mb-2">Cảm ơn bạn đã sử dụng dịch vụ.</p>
      <p className="text-sm text-gray-600">Bạn sẽ được chuyển về trang chủ trong vài giây...</p>
    </div>
  );
};

export default PaymentSuccess;
