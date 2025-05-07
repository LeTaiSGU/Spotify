import React from "react";
import { FcApproval } from "react-icons/fc";

const FinalStep = ({ userData }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
      <FcApproval size={100} />
      <h2 className="text-2xl font-semibold text-white">Đăng ký thành công!</h2>
      <p className="text-gray-400 text-sm">
        Chào mừng bạn đến với nền tảng của chúng tôi,{" "}
        <span className="text-white font-medium">{userData.email}</span>
      </p>
      <a
        href="/login"
        className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full transition"
      >
        Về trang đăng nhập
      </a>
    </div>
  );
};

export default FinalStep;
