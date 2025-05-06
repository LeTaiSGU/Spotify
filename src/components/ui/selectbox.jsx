import Select from "react-select";

function SelectBox({ value, onChange, options, placeholder, error, name }) {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#121212",
      borderColor: error ? "#ef4444" : "#4b5563",
      boxShadow: state.isFocused
        ? error
          ? "0 0 0 2px rgba(239, 68, 68, 0.5)"
          : "0 0 0 2px rgba(34, 197, 94, 0.5)"
        : "none",
      "&:hover": {
        borderColor: error ? "#ef4444" : "#10b981",
      },
      color: "#fff",
      borderRadius: "6px",
      padding: "2px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#121212",
      border: "1px solid #333",
      borderRadius: "6px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
      zIndex: 10,
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "150px",
      padding: "4px",
      "::-webkit-scrollbar": {
        width: "6px",
      },
      "::-webkit-scrollbar-track": {
        background: "#222",
        borderRadius: "3px",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#555",
        borderRadius: "3px",
        "&:hover": {
          background: "#777",
        },
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#333" : "#121212",
      color: "#fff",
      cursor: "pointer",
      padding: "8px 12px",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#333",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#9ca3af",
      "&:hover": {
        color: "#fff",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <Select
      value={options.find((opt) => opt.value === value)}
      onChange={(selected) =>
        onChange({ target: { name: name || "select", value: selected.value } })
      }
      options={options}
      placeholder={placeholder}
      styles={customStyles}
      isSearchable={false}
      classNamePrefix="spotify-select"
    />
  );
}

export default SelectBox;
