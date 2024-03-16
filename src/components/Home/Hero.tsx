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
      <section className="py-[40px] bg-[#F6995C]">
        <h3 className="uppercase text-center mb-[20px] font-bold sm:mb-[40px] sm:text-[20px]">
          Why Orange Market?
        </h3>
        <div className="flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:justify-around md:mx-[120px]">
          <article className="text-center">
            <div className="text-[32px] text-gray-400">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
            <h4 className="font-bold">Easy</h4>
            <p className="text-[14px] my-[10px]">
              Just one click <br />
              to get the desired goods
            </p>
          </article>
          <article className="text-center">
            <div className="text-[32px] text-gray-400">
              <i className="fa-solid fa-map-location-dot"></i>
            </div>
            <h4 className="font-bold">Convenient</h4>
            <p className="text-[14px] my-[10px]">
              Trade goods wherever <br />
              and whenever you want
            </p>
          </article>
          <article className="text-center">
            <div className="text-[32px] text-gray-400">
              <i className="fa-solid fa-sack-dollar"></i>
            </div>
            <h4 className="font-bold">Reasonable Price</h4>
            <p className="text-[14px] my-[10px]">
              No fees <br />
              for selling or purchasing
            </p>
          </article>
        </div>
      </section>
    </>
  );
};

export default Hero;
