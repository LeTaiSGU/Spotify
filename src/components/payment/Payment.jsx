import React, { useEffect } from 'react';
import axios from 'axios';
import { addMonths } from 'date-fns';
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
  useEffect(() => {
    // Gửi request GET để Django trả về CSRF cookie
    axios.get("http://localhost:8000/api/payments/csrf/", { withCredentials: true });
  }, []);

  const handlePayment = async () => {
   
    try {
      const formData = new FormData();
      formData.append("amount", 99000); // Số tiền thanh toán
      formData.append("orderInfo", "Thanh toán đơn hàng");
  
    // Dữ liệu cứng
      formData.append("userId", 1); // ID user cứng
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      formData.append("payDate", today); // Ngày thanh toán hiện tại
      const response = await axios.post("http://localhost:8000/api/payments/momo/", formData, {
        
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        withCredentials: true,
      });
      console.log("Phản hồi:", response);

      const payUrl = response.data.payUrl;
      if (payUrl) {
        window.location.href = payUrl; //  Chuyển hướng người dùng
      } else {
        alert("Không thể lấy link thanh toán từ server.");
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

// def momo_payment(request):
//     if request.method == "POST":
//         amount = request.POST.get("amount")
//         order_info = request.POST.get("orderInfo")

//         # Momo config
//         endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
//         partnerCode = "MOMO"
//         accessKey = "F8BBA842ECF85"
//         secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
//         redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b"
//         ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b"
//         requestType = "payWithATM"
//         orderId = str(uuid.uuid4())
//         requestId = str(uuid.uuid4())
//         extraData = ""

//         raw_signature = (
//             f"accessKey={accessKey}&amount={amount}&extraData={extraData}"
//             f"&ipnUrl={ipnUrl}&orderId={orderId}&orderInfo={order_info}"
//             f"&partnerCode={partnerCode}&redirectUrl={redirectUrl}"
//             f"&requestId={requestId}&requestType={requestType}"
//         )

//         signature = hmac.new(
//             bytes(secretKey, 'utf-8'),
//             bytes(raw_signature, 'utf-8'),
//             hashlib.sha256
//         ).hexdigest()

//         data = {
//             "partnerCode": partnerCode,
//             "partnerName": "Test",
//             "storeId": "MomoTestStore",
//             "requestId": requestId,
//             "amount": amount,
//             "orderId": orderId,
//             "orderInfo": order_info,
//             "redirectUrl": redirectUrl,
//             "ipnUrl": ipnUrl,
//             "lang": "vi",
//             "extraData": extraData,
//             "requestType": requestType,
//             "signature": signature
//         }

//         response = requests.post(endpoint, json=data, headers={'Content-Type': 'application/json'})
//         result = response.json()
//         pay_url = result.get("payUrl")

//         if pay_url:
//             return JsonResponse({"payUrl": pay_url})
//         else:
//             return JsonResponse({"error": "Không thể tạo liên kết thanh toán."}, status=400)

//     return JsonResponse({"error": "Method not allowed"}, status=405)

// @ensure_csrf_cookie
// def get_csrf_token(request):
//     return JsonResponse({"message": "CSRF cookie set."})
