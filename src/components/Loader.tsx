import { FadeLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="h-[70vh] flex flex-col justify-center items-center">
      <FadeLoader color="#C7C8CC" />
    </div>
  );
};

export default Loader;
