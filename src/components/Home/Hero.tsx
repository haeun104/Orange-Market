import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <section className="bg-hero-bg-image bg-cover h-calc-vh-minus-64">
        <div className="max-h-[600px]">
          <div className="flex flex-col space-y-5 align-middle pt-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <h2 className="text-center text-lg  text-main-orange font-bold sm:text-2xl lg:text-4xl text-nowrap">
              Your Marketplace for Pre-Loved Finds
            </h2>
            <span className="text-center text-md text-gray-700 lg:text-xl">
              Sell and Buy Secondhand Treasures In The Simplest Way!
            </span>
            <div className="text-center">
              <Link to="/products" className="underline hover:opacity-70">
                See new offers now!
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
