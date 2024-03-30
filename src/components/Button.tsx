interface ButtonProps {
  title: string;
  onClick?: () => void;
  btnColor: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  btnColor,
  disabled,
}) => {
  return (
    <button
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
