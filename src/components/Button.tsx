interface ButtonProps {
  title: string;
  onClick?: () => void;
  btnColor: string;
}

const Button: React.FC<ButtonProps> = ({ title, onClick, btnColor }) => {
  return (
    <button onClick={onClick} className={`btn-${btnColor}`}>
      {title}
    </button>
  );
};

export default Button;
