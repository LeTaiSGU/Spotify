import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import dispatch từ Redux
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ErrorMessage from "../../components/ui/error-message";
import { updateUser } from "../../apis";
import { toast } from "react-toastify";
import { fetchCurrentUser } from "../../redux/slice/authSlice"; // Import fetchCurrentUser

const EditProfileForm = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch(); // Khởi tạo dispatch
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    gender: user.gender,
    dob: user.dob,
  });

  // Thay đổi từ object errors sang các state riêng biệt
  const [nameError, setNameError] = useState(null);
  const [genderError, setGenderError] = useState(null);
  const [birthDateError, setBirthDateError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi khi người dùng nhập
    if (name === "name") setNameError(null);
    if (name === "gender") setGenderError(null);
  };

  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      dob: e.target.value,
    });

    // Xóa lỗi khi người dùng thay đổi ngày
    setBirthDateError(null);
  };

  const validateForm = () => {
    let isValid = true;

    // Reset các lỗi
    setNameError(null);
    setGenderError(null);
    setBirthDateError(null);

    if (!formData.name || formData.name.trim() === "") {
      setNameError("Vui lòng nhập họ và tên");
      isValid = false;
    }

    if (!formData.gender) {
      setGenderError("Vui lòng chọn giới tính");
      isValid = false;
    }

    if (!formData.dob) {
      setBirthDateError("Vui lòng chọn ngày sinh");
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
      // Gửi yêu cầu cập nhật
      await updateUser(user.id, {
        name: formData.name,
        gender: formData.gender,
        dob: formData.dob,
      });

      // Gọi lại fetchCurrentUser để cập nhật dữ liệu mới
      await dispatch(fetchCurrentUser());

      // Hiển thị thông báo thành công
      toast.success("Thông tin đã được cập nhật thành công!");
    } catch (error) {
      // Hiển thị thông báo lỗi
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin.");
      console.error(error);
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
          <h1 className="text-2xl font-bold">Chỉnh sửa hồ sơ</h1>
        </div>

        <div className="w-2/4 mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Họ và tên */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-white mb-2">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="w-full bg-[#3E3E3E] h-11 text-gray-300 border-none rounded-md p-2 focus:bg-[#4A4A4A] focus:outline-none focus:ring-1 focus:ring-[#525252]"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-white mb-2">
                Họ và tên
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#3E3E3E] h-11 text-white border border-[#7C7C7C] rounded-md p-2 hover:bg-[#454545] focus:bg-[#4A4A4A] focus:outline-none focus:border-white transition-colors duration-200"
              />
              {nameError && <ErrorMessage message={nameError} />}
            </div>

            {/* Giới tính */}
            <div className="mb-4">
              <label htmlFor="gender" className="block text-white mb-2">
                Giới tính
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#3E3E3E] h-11 text-white border border-[#7C7C7C] rounded-md p-2 hover:bg-[#454545] focus:bg-[#4A4A4A] focus:outline-none focus:border-white cursor-pointer transition-colors duration-200"
              >
                <option value="True" className="bg-[#3E3E3E]">
                  Nam
                </option>
                <option value="False" className="bg-[#3E3E3E]">
                  Nữ
                </option>
              </select>
              {genderError && <ErrorMessage message={genderError} />}
            </div>

            {/* Ngày sinh */}
            <div className="mb-4">
              <label htmlFor="dob" className="block text-white mb-2">
                Ngày sinh
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleDateChange}
                className="w-full bg-[#3E3E3E] h-11 text-white border border-[#7C7C7C] rounded-md p-2 hover:bg-[#454545] focus:bg-[#4A4A4A] focus:outline-none focus:border-white transition-colors duration-200"
              />
              {birthDateError && <ErrorMessage message={birthDateError} />}
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

export default EditProfileForm;
