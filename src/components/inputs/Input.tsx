import { ChangeEvent } from "react";

interface InputProps {
  type?: string;
  id: string;
  className?: string;
  value: string;
  disabled: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  id,
  className = "basic-input disabled:bg-gray-200",
  value,
  disabled,
  name,
  onChange,
  label,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        className={className}
        value={value}
        disabled={disabled}
        name={id}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
