import buyer from "../../assets/buyer.png";
import seller from "../../assets/seller.png";

const Features = () => {
  return (
    <>
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
      <section className="lg:flex">
        <div className="bg-[#EEEEEE] py-[50px] px-[15px] lg:w-1/2">
          <h3 className="uppercase text-center mb-[10px] font-bold sm:mb-[20px] sm:text-[20px]">
            Are you a seller?
          </h3>
          <div className="h-[70px] w-[70px] mx-auto mb-[20px]">
            <img src={seller} alt="seller" />
          </div>
          <div className="flex space-x-2 justify-center align-middle">
            <span className="text-center text-[13px] sm:text-[16px] my-auto">
              Sign up
            </span>
            <div className="text-[20px] my-auto">&gt;&gt;</div>
            <span className="text-center text-[13px] sm:text-[16px] my-auto">
              Register
              <br /> your item
            </span>
            <div className="text-[20px] my-auto">&gt;&gt;</div>
            <span className="text-center text-[13px] sm:text-[16px] my-auto">
              Confirm
              <br />
              purchase request
            </span>
            <div className="text-[20px] my-auto">&gt;&gt;</div>
            <span className="text-center text-[13px] sm:text-[16px] my-auto">
              Pass <br />
              your item
            </span>
          </div>
        </div>
        <div className="py-[50px] px-[15px] lg:w-1/2">
          <h3 className="uppercase text-center mb-[10px] font-bold sm:mb-[20px] sm:text-[20px] text-main-orange">
            Are you a buyer?
          </h3>
          <div className="h-[70px] w-[70px] mx-auto mb-[20px]">
            <img src={buyer} alt="buyer" />
          </div>
          <div className="flex space-x-2 justify-center align-middle">
            <span className="text-center text-[13px] sm:text-[16px] my-auto">
              Sign up
            </span>
            <div className="text-[20px] my-auto">&gt;&gt;</div>
            <span className="text-center text-[13px] sm:text-[16px] my-auto">
              Send
              <br /> purchase request
            </span>
            <div className="text-[20px] my-auto">&gt;&gt;</div>
            <span className="text-center text-[13px] sm:text-[16px] my-auto">
              Check
              <br />
              request status
            </span>
            <div className="text-[20px] my-auto">&gt;&gt;</div>
            <span className="text-center text-[13px] sm:text-[16px] my-auto">
              Get <br />
              your item
            </span>
          </div>
        </div>
      </section>
      <section className="h-[90vh] bg-cover bg-center animate-homeImagesSm md:animate-homeImages flex justify-center align-middle">
        <h2 className="uppercase text-white font-bold text-[22px] md:text-[32px] text-center my-auto">
          Register your first product now <br />
          and <br />
          enjoy convenience!
        </h2>
      </section>
    </>
  );
};

export default Features;
