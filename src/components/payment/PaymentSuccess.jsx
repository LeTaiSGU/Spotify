import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPosted = useRef(false);

  useEffect(() => {
    if (isPosted.current) return;

    const query = new URLSearchParams(location.search);
    const userId = query.get("userId");
    const amount = query.get("amount");
    const payDate = query.get("payDate");

    if (!userId || !amount || !payDate) return;

    const exprDate = new Date(
      new Date(payDate).getTime() + 30 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    const paymentData = {
      userId,
      amount,
      payDate,
      exprDate,
      status: "success",
    };

    axios
      .post(`${API_ROOT}/api/payments/save-payment/`, paymentData, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
      .then(() => {
        console.log("✅ Lưu thanh toán thành công");
        isPosted.current = true; 
      })
      .catch((err) => {
        console.error("❌ Lỗi lưu thanh toán:", err);
      });

    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen layout">
      <h1 className="text-4xl font-bold text-green-500 mb-4">
        🎉 Thanh toán thành công!
      </h1>
      <p className="text-lg mb-2">Cảm ơn bạn đã sử dụng dịch vụ.</p>
      <p className="text-sm text-gray-600">
        Bạn sẽ được chuyển về trang chủ trong vài giây...
      </p>
    </div>
  );
};

export default PaymentSuccess;
