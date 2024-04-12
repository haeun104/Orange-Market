import { ChangeEvent } from "react";

interface InputProps {
  type?: string;
  id: string;
  className?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label: string;
  required?: boolean;
  max?: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  id,
  className = "basic-input disabled:bg-gray-200",
  value,
  disabled,
  onChange,
  label,
  required,
  max,
  textarea,
  placeholder,
  rows,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea
          id={id}
          className={className}
          rows={rows}
          placeholder={placeholder}
          name={id}
          required={required}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          id={id}
          className={className}
          value={value}
          disabled={disabled}
          name={id}
          onChange={onChange}
          required={required}
          max={max}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default Input;
