import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero-section relative">
      <div className="hero-image max-h-[600px] overflow-hidden">
        <div className="flex flex-col space-y-5 align-middle pt-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <h2 className="text-center text-lg text-gray-700 font-bold sm:text-2xl lg:text-4xl text-nowrap">
            Your Marketplace for Pre-Loved Finds
          </h2>
          <span className="text-center text-md text-main-orange lg:text-xl">
            Sell and Buy Secondhand Treasures In The Simplest Way!
          </span>
          <div className="flex justify-center space-x-4">
            <Link to="/products">
              <div className="text-gray-500 px-3 py-2 text-sm font-medium border-solid border-gray-500 border-2 w-28 h-[75px] text-center lg:text-xl lg:w-40">
                See new offers
              </div>
            </Link>
            <Link to="/login">
              <div className="text-gray-500 px-3 py-2 text-sm font-medium border-solid border-main-orange border-2 w-28 h-[75px] text-center lg:text-xl lg:w-40">
                Log in for more details
              </div>
            </Link>
          </div>
        </div>
        <img
          src="src/assets/hero-bg-image-lg.jpg"
          alt="hero-image"
          className="absolute top-0 left-0"
        />
      </div>
    </section>
  );
};

export default Hero;
