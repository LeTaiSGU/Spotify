import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { changePassword } from "../../apis";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ErrorMessage from "../../components/ui/error-message";
import PasswordToggleButton from "../../components/ui/password-toggle-button";
import { toast } from "react-toastify";

const ChangePass = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State cho việc hiển thị/ẩn mật khẩu
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Các state riêng biệt cho lỗi
  const [currentPasswordError, setCurrentPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi khi người dùng nhập
    if (name === "currentPassword") setCurrentPasswordError(null);
    if (name === "newPassword") setNewPasswordError(null);
    if (name === "confirmPassword") setConfirmPasswordError(null);
  };

  const validateForm = () => {
    let isValid = true;

    // Reset các lỗi
    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);

    if (!formData.currentPassword) {
      setCurrentPasswordError("Vui lòng nhập mật khẩu hiện tại");
      isValid = false;
    }

    if (!formData.newPassword) {
      setNewPasswordError("Vui lòng nhập mật khẩu mới");
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      setNewPasswordError("Mật khẩu từ 8 ký tự trở lên");
      isValid = false;
    }

    if (!formData.confirmPassword) {
      setConfirmPasswordError("Vui lòng xác nhận mật khẩu mới");
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await changePassword(user.id, {
        old_password: formData.currentPassword,
        new_password: formData.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error;

        // Hiển thị lỗi cho trường mật khẩu cũ
        if (errorMessage === "Mật khẩu cũ không đúng") {
          setCurrentPasswordError(errorMessage);
        } else {
          toast.error(errorMessage || "Đã xảy ra lỗi!");
        }
      } else {
        toast.error("Không thể kết nối đến server!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full custom-scrollbar">
      <div className="mx-auto p-4 md:p-6 bg-[#1C1917] min-h-screen text-white">
        <div className="mb-4 flex items-center">
          <button
            type="button"
            className="text-white hover:bg-[#474747] mr-3 rounded-full p-2 flex items-center justify-center"
            onClick={() => navigate("/account")}
          >
            <ArrowLeftOutlined className="text-white" />
          </button>
          <h1 className="text-2xl font-bold">Đổi mật khẩu</h1>
        </div>

        <div className="w-2/4 mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mật khẩu hiện tại */}
            <div className="mb-4">
              <label
                htmlFor="currentPassword"
                className="block text-white mb-2"
              >
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu hiện tại"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full bg-[#3E3E3E] h-11 text-white border border-[#7C7C7C] rounded-md p-2 hover:bg-[#454545] focus:bg-[#4A4A4A] focus:outline-none focus:border-white transition-colors duration-200"
                />
                <PasswordToggleButton
                  showPassword={showCurrentPassword}
                  togglePassword={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                />
              </div>
              {currentPasswordError && (
                <ErrorMessage message={currentPasswordError} />
              )}
            </div>

            {/* Mật khẩu mới */}
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-white mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-[#3E3E3E] h-11 text-white border border-[#7C7C7C] rounded-md p-2 hover:bg-[#454545] focus:bg-[#4A4A4A] focus:outline-none focus:border-white transition-colors duration-200"
                />
                <PasswordToggleButton
                  showPassword={showNewPassword}
                  togglePassword={() => setShowNewPassword(!showNewPassword)}
                />
              </div>
              {newPasswordError && <ErrorMessage message={newPasswordError} />}
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-white mb-2"
              >
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#3E3E3E] h-11 text-white border border-[#7C7C7C] rounded-md p-2 hover:bg-[#454545] focus:bg-[#4A4A4A] focus:outline-none focus:border-white transition-colors duration-200"
                />
                <PasswordToggleButton
                  showPassword={showConfirmPassword}
                  togglePassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
              </div>
              {confirmPasswordError && (
                <ErrorMessage message={confirmPasswordError} />
              )}
            </div>

            {/* Submit button */}
            <div className="pt-5 mt-8 border-t border-gray-800">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1DB954] hover:bg-[#1ED760] text-black font-medium rounded-full px-8 h-10 border-none float-right flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang cập nhật
                  </>
                ) : (
                  "Cập nhật"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
