import React from "react";
import { Card } from "antd";
import {
  EditOutlined,
  LockOutlined,
  CreditCardOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
function AccountInfo() {
  const navigate = useNavigate();

  const items = [
    {
      icon: <EditOutlined className="text-lg" />,
      text: "Chỉnh sửa hồ sơ",
      path: "/account/edit",
    },
    {
      icon: <LockOutlined className="text-lg" />,
      text: "Đổi mật khẩu",
      path: "/account/change-password",
    },
    {
      icon: <CreditCardOutlined className="text-lg" />,
      text: "Quản lý gói đăng ký",
      path: "/account/subscriptions",
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="w-full h-full custom-scrollbar">
        <Card className="!h-full !bg-[#1C1917] !text-white !border-none">
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center bg-[#2F2F2F] justify-between hover:bg-[#3a3a3a] p-3 rounded-md cursor-pointer transition-all duration-200"
                onClick={() => handleNavigate(item.path)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#3a3a3a] p-2 rounded-md">{item.icon}</div>
                  <span className="text-base">{item.text}</span>
                </div>
                <RightOutlined />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

export default AccountInfo;
