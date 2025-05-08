import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const PasswordToggleButton = ({ showPassword, togglePassword }) => {
  return (
    <button
      type="button"
      onClick={togglePassword}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
    >
      {showPassword ? (
        <EyeIcon className="h-5 w-5" />
      ) : (
        <EyeSlashIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default PasswordToggleButton;
