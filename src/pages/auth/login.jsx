import SpotifyIcon from "../../components/ui/spotify-icon";
import LoginForm from "../../components/login/loginForm";
import SocialLoginButtons from "../../components/ui/social-button";
import { toast } from "react-toastify";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg p-6">
        {/* Spotify Logo */}
        <SpotifyIcon />

        {/* Heading Label*/}
        <h1 className="text-center text-3xl font-bold text-white">
          Đăng nhập vào Spotify
        </h1>

        {/* Social Login Buttons */}
        <SocialLoginButtons />

        <div className="relative">
          <div className="absolute inset-0 flex items-center ">
            <div className="w-full border-t border-gray-600"></div>
          </div>
        </div>
        <br />

        {/* Login Form */}
        <LoginForm />

        {/* Forgot Password */}
        <div className="text-center">
          <button
            onClick={() =>
              toast.error("Chức năng quên mật khẩu chưa được triển khai.")
            }
            className="text-sm text-white underline hover:text-[#1DB954] bg-transparent border-none cursor-pointer"
          >
            Quên mật khẩu của bạn?
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Bạn chưa có tài khoản?{" "}
            <a
              href="/signup"
              className="text-white underline hover:text-[#1DB954]"
            >
              Đăng ký Spotify
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
