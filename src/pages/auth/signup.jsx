import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SpotifyIcon from "../../components/ui/spotify-icon";
import EmailStep from "../../components/signup/signup-with-email/emailStep";
import PasswordStep from "../../components/signup/signup-with-email/passwordStep";
import InformationStep from "../../components/signup/signup-with-email/informationStep";
import FinalStep from "../../components/signup/signup-with-email/finalStep";
import SocialLoginButtons from "../../components/ui/social-button";
import DividerWithText from "../../components/ui/divider-with-text";

const SignUpPage = () => {
  const [startedSignup, setStartedSignup] = useState(false);
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Trạng thái dữ liệu người dùng để truyền giữa các bước
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
    dob: "",
    gender: "",
  });

  // Phân tích bước từ URL hash nếu có
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    const stepNumber = parseInt(hash);

    if (!startedSignup) {
      navigate("", { replace: true }); // Trả về trang nhập email
      setStep(0); // Đảm bảo UI phản ánh đúng
      return;
    }

    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 3) {
      navigate(`#${step}`, { replace: true });
    } else {
      const canAccessStep =
        stepNumber === 1 || completedSteps.includes(stepNumber - 1);

      if (canAccessStep) {
        setStep(stepNumber);
      } else {
        const highestAllowedStep = Math.max(...completedSteps, 1);
        navigate(`#${highestAllowedStep}`, { replace: true });
        setStep(highestAllowedStep);
      }
    }
  }, [location.hash, completedSteps, startedSignup, navigate, step]);

  const cancelSignup = () => {
    setStartedSignup(false);
    setCompletedSteps([]); // Reset toàn bộ trạng thái
    setUserData({
      email: "",
      password: "",
      name: "",
      birthdate: "",
      gender: "",
    });
    navigate("", { replace: true }); // Quay về trang email
  };

  useEffect(() => {
    sessionStorage.setItem("signupStep", step);
    sessionStorage.setItem("userData", JSON.stringify(userData));
    sessionStorage.setItem("completedSteps", JSON.stringify(completedSteps));
  }, [step, userData, completedSteps]);

  useEffect(() => {
    const savedStep = sessionStorage.getItem("signupStep");
    const savedData = sessionStorage.getItem("userData");
    const savedCompleted = sessionStorage.getItem("completedSteps");

    if (savedStep) setStep(parseInt(savedStep));
    if (savedData) setUserData(JSON.parse(savedData));
    if (savedCompleted) setCompletedSteps(JSON.parse(savedCompleted));
  }, []);

  // Hàm cập nhật dữ liệu người dùng từ các bước riêng lẻ
  const updateUserData = (data) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Bắt đầu quy trình đăng ký sau khi nhập email
  const startSignupProcess = (emailData) => {
    updateUserData(emailData);
    setStartedSignup(true);
    setStep(1);
    navigate("#1");
  };

  // Chuyển đến bước tiếp theo
  const nextStep = () => {
    const newStep = step + 1;
    // Đánh dấu bước hiện tại là đã hoàn thành
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
    setStep(newStep);
    navigate(`#${newStep}`);
  };

  // Quay lại bước trước đó
  const prevStep = () => {
    const newStep = step - 1;
    setStep(newStep);
    navigate(`#${newStep}`);
  };

  // Hiển thị màn hình nhập email (mặc định của trang đăng ký)
  if (!startedSignup) {
    return (
      <div className="flex min-h-screen justify-center bg-black p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg p-6">
          <SpotifyIcon />

          <h1 className="text-center text-4xl font-bold text-white">
            Đăng ký để bắt đầu nghe nhạc
          </h1>

          {/* Biểu mẫu nhập email */}
          <EmailStep
            nextStep={startSignupProcess}
            userData={userData}
            updateUserData={updateUserData}
          />

          <DividerWithText text="hoặc" />
          {/* Các nút đăng nhập bằng mạng xã hội */}
          <SocialLoginButtons signUp={true} />

          <DividerWithText />
          {/* Liên kết đăng nhập */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Đã có tài khoản?{" "}
              <a href="/login" className="text-white hover:underline">
                Đăng nhập tại đây
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg">
        <SpotifyIcon />

        <h1 className="text-center text-4xl font-bold text-white">
          Đăng ký tài khoản Spotify
        </h1>

        {/* Chỉ báo bước đăng ký với 3 bước */}

        <div className="flex justify-center mb-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= num ? "bg-green-500" : "bg-gray-600"
                } text-white`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`h-1 w-6 ${
                    step > num ? "bg-green-500" : "bg-gray-600"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        {step < 3 && (
          <>
            <div className="bg-[#121212] p-3 rounded-md border border-gray-700 mb-4">
              <div className="flex justify-between items-center">
                <div className="text-gray-400 text-sm">
                  <span>Email:</span>
                  <span className="ml-2 text-white font-medium">
                    {userData.email}
                  </span>
                </div>
                <button
                  onClick={cancelSignup}
                  className="text-xs text-green-500 hover:text-green-400 hover:underline"
                >
                  Thay đổi
                </button>
              </div>
            </div>
          </>
        )}

        {/* Nội dung các bước */}
        <div className="mt-4">
          {step === 1 && (
            <PasswordStep
              nextStep={nextStep}
              userData={userData}
              updateUserData={updateUserData}
            />
          )}
          {step === 2 && (
            <InformationStep
              nextStep={nextStep}
              prevStep={prevStep}
              userData={userData}
              updateUserData={updateUserData}
            />
          )}
          {step === 3 && <FinalStep prevStep={prevStep} userData={userData} />}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
