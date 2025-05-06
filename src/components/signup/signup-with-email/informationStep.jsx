import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "~/redux/slice/authSlice";
import ErrorMessage from "../../ui/error-message";
import BirthdateSelect from "../../ui/signup-birthday-select";
import GenderSelect from "../../ui/signu-gender-radiobox";
import InputField from "../../ui/field-input";

const InformationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    day: userData.dob ? new Date(userData.dob).getDate() : "",
    month: userData.dob ? new Date(userData.dob).getMonth() + 1 : "",
    year: userData.dob ? new Date(userData.dob).getFullYear() : "",
    gender: userData.gender || "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const newErrors = {};
    const required =
      formData.name &&
      formData.day &&
      formData.month &&
      formData.year &&
      formData.gender;

    if (formData.name && formData.name.trim() === "") {
      newErrors.name = "Vui lòng nhập tên của bạn";
    }

    if (
      (formData.day || formData.month || formData.year) &&
      (!formData.day || !formData.month || !formData.year)
    ) {
      newErrors.birthdate = "Vui lòng chọn ngày sinh đầy đủ";
    } else if (formData.day && formData.month && formData.year) {
      const birth = new Date(formData.year, formData.month - 1, formData.day);
      const min = new Date();
      min.setFullYear(min.getFullYear() - 13);
      if (birth > min) newErrors.birthdate = "Bạn phải đủ 13 tuổi để đăng ký";
    }

    if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0 && required);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const dob = new Date(formData.year, formData.month - 1, formData.day)
      .toISOString()
      .slice(0, 10);

    updateUserData({
      name: formData.name,
      dob,
      gender: formData.gender,
    });

    const fullUserData = {
      ...userData,
      name: formData.name,
      dob,
      gender: formData.gender,
    };
    dispatch(registerUser(fullUserData))
      .unwrap()
      .then(() => {
        toast.success("Đăng ký thành công!");
        nextStep(); // Sang FinalStep
      })
      .catch(() => {
        toast.error(error || "Đăng ký không thành công!");
      });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Cho chúng tôi biết về bạn
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Họ tên */}
        <div className="space-y-1">
          <InputField
            label="Họ tên"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Nhập họ tên của bạn"
          />
          {errors.name && <ErrorMessage message={errors.name} />}
        </div>
        <BirthdateSelect
          formData={formData}
          onChange={handleChange}
          errors={errors}
        />
        {errors.birthdate && <ErrorMessage message={errors.birthdate} />}
        <GenderSelect
          value={formData.gender}
          onChange={handleChange}
          error={errors.gender}
        />
        <div className="flex space-x-4 pt-2">
          <button
            type="button"
            onClick={prevStep}
            className="w-1/2 py-3 rounded-full font-semibold bg-transparent border border-gray-500 text-white hover:border-white"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-1/2 py-3 rounded-full font-semibold 
              ${
                isValid && !loading
                  ? "bg-green-500 hover:bg-green-400 text-black"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
          >
            {loading ? "Đang đăng ký..." : "Hoàn tất đăng ký"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InformationStep;
