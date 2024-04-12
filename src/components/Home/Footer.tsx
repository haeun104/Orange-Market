import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="p-[20px]">
      <div>
        <div className="flex flex-shrink-0 items-center">
          <Link to="/" className="flex">
            <img
              className="h-[22px] w-auto size-5"
              src="src\assets\logo_orange.png"
              alt="company logo"
            />
            <h1 className="text-[18px] font-semibold">Orange Market</h1>
          </Link>
        </div>
        <div className="text-[12px] sm:text-[14px] text-gray-400">
          <span className="font-bold">Address</span>&nbsp;&nbsp;kwiatowa 7
          Warszawa 12-345 Poland
        </div>
        <div className="text-[12px] sm:text-[14px] text-gray-400">
          <span className="font-bold">Phone</span>&nbsp;&nbsp;123-456-789
        </div>
        <div className="text-[12px] sm:text-[14px] text-gray-400">
          <span className="font-bold">Email</span>
          &nbsp;&nbsp;service@orangemarket.com
        </div>
      </div>
      <div className="text-[12px] sm:text-center text-gray-400 mt-[20px]">
        Copyright &copy; 2024 Orange Market. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
