import { useState } from "react";
import EmailField from "../ui/email-input";
import PasswordField from "../ui/password-input";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "~/redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) return;
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        alert("Đăng nhập thành công!");
        navigate("/");
      })
      .catch(() => {
        // error sẽ được lấy từ state.auth.error
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EmailField
        email={email}
        setEmail={setEmail}
        setIsEmailValid={setIsEmailValid}
      />
      <PasswordField
        password={password}
        setPassword={setPassword}
        setIsPasswordValid={setIsPasswordValid}
      />

      <div className="pt-2">
        <button
          type="submit"
          disabled={!isEmailValid || !isPasswordValid || loading}
          className={`w-full py-3 rounded-full font-semibold 
              ${
                isEmailValid && isPasswordValid && !loading
                  ? "bg-green-500 hover:bg-green-400 text-black"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </form>
  );
};

export default LoginForm;
