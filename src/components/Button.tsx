import { MouseEvent } from "react";

interface ButtonProps {
  title: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  btnColor: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  btnColor,
  disabled,
  type,
}) => {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      className={`btn-${btnColor} ${
        disabled
          ? "disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:opacity-100"
          : ""
      }`}
    >
      {title}
    </button>
  );
};

export default Button;
