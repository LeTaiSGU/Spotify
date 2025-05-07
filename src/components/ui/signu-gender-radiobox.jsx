import { FaCheck } from "react-icons/fa";

const GenderSelect = ({ value, onChange }) => {
  const options = [
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        Giới tính
      </label>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-center justify-center px-4 py-3 rounded-md border 
              ${
                value === option.value
                  ? "border-green-500 bg-[#1A3D2C] ring-1 ring-green-500"
                  : "border-gray-600 bg-[#121212] hover:border-green-400 hover:bg-[#1d1d1d]"
              } 
              cursor-pointer transition-all duration-200 ease-in-out
            `}
          >
            <input
              type="radio"
              name="gender"
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="sr-only"
            />
            <span className="text-white font-medium">{option.label}</span>

            {value === option.value && (
              <span className="absolute right-3 text-green-500">
                <FaCheck size={14} />
              </span>
            )}
          </label>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Thông tin này sẽ xuất hiện trên trang hồ sơ của bạn
      </p>
    </div>
  );
};

export default GenderSelect;
