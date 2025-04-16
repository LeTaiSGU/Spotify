import { useState, useEffect } from "react";
import InputField from "../ui/field-input";
import PasswordToggleButton from "../ui/password-toggle-button";
import ErrorMessage from "../ui/error-message";

const PasswordField = ({ password, setPassword, setIsPasswordValid }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (password) {
      const isValid = password.length >= 8;
      setIsPasswordValid(isValid);
      setPasswordError(isValid ? "" : "Mật khẩu phải có ít nhất 8 ký tự");
    } else {
      setIsPasswordValid(false);
      setPasswordError("");
    }
  }, [password, setIsPasswordValid]);

  return (
    <div className="space-y-2">
      <label htmlFor={""} className="block text-sm font-medium text-white">
        {"Mật khẩu"}
      </label>
      <div className="relative">
        <InputField
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          error={passwordError}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"Nhập mật khẩu của bạn"}
        />
        <PasswordToggleButton
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
        />
      </div>
      {passwordError && <ErrorMessage message={passwordError} />}
    </div>
  );
};

export default PasswordField;
