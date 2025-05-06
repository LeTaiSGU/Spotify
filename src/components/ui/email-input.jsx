import { useState, useEffect } from "react";
import InputField from "../ui/field-input";
import ErrorMessage from "../ui/error-message";

const EmailField = ({ email, setEmail, setIsEmailValid }) => {
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      setIsEmailValid(isValid);
      setEmailError(isValid ? "" : "Email không hợp lệ");
    } else {
      setIsEmailValid(false);
      setEmailError("");
    }
  }, [email, setIsEmailValid]);

  return (
    <div className="emailInput space-y-1">
      <InputField
        label="Địa chỉ email"
        id="email"
        type="email"
        value={email}
        error={emailError}
        placeholder={"Nhập địa chỉ email của bạn"}
        onChange={(e) => setEmail(e.target.value.trim())}
      />
      {emailError && <ErrorMessage message={emailError} />}
    </div>
  );
};

export default EmailField;
