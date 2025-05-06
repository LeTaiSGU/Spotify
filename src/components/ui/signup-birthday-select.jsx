import SelectBox from "./selectbox";
import { useMemo } from "react";

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

const BirthdateSelect = ({ formData, onChange, errors }) => {
  const months = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      value: i + 1,
      label: `Tháng ${i + 1}`,
    }));
  }, []);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => current - i);
  }, []);

  const days = useMemo(() => {
    const count =
      formData.year && formData.month
        ? getDaysInMonth(formData.month, formData.year)
        : 31;
    return Array.from({ length: count }, (_, i) => ({
      value: i + 1,
      label: i + 1,
    }));
  }, [formData.month, formData.year]);

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        Ngày sinh
      </label>
      <div className="grid grid-cols-3 gap-3">
        <SelectBox
          name="day"
          value={formData.day}
          onChange={onChange}
          options={days}
          placeholder="Ngày"
          error={errors.birthdate}
        />
        <SelectBox
          name="month"
          value={formData.month}
          onChange={onChange}
          options={months}
          placeholder="Tháng"
          error={errors.birthdate}
        />
        <SelectBox
          name="year"
          value={formData.year}
          onChange={onChange}
          options={years.map((year) => ({ value: year, label: year }))}
          placeholder="Năm"
          error={errors.birthdate}
        />
      </div>
    </div>
  );
};

export default BirthdateSelect;
