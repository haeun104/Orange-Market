const Hero = () => {
  return (
    <section className="hero-section mt-5 lg:flex lg:flex-row-reverse lg:justify-between lg:align-middle">
      <div className="flex flex-col space-y-5 align-middle mx-10 lg:w-1/2 lg:mt-12 lg:space-y-12">
        <h2 className="text-center text-md text-main-orange font-bold sm:text-2xl lg:text-4xl">
          Your Marketplace for Pre-Loved Finds
        </h2>
        <span className="text-center text-lg text-gray-500 lg:text-xl">
          Sell and Buy Secondhand Treasures In The Simplest Way!
        </span>
        <div className="flex justify-center space-x-4">
          <a
            href="#"
            className="text-gray-500 px-3 py-2 text-sm font-medium border-solid border-gray-300 border-2 w-28 text-center lg:text-xl lg:w-40"
          >
            See new offers
          </a>
          <a
            href="#"
            className="text-gray-500 px-3 py-2 text-sm font-medium border-solid border-main-orange border-2 w-28 text-center lg:text-xl lg:w-40"
          >
            Log in for more details
          </a>
        </div>
      </div>
      <div className="hero-image">
        <img
          src="src\assets\hero-Image.jpg"
          alt="hero-image"
          className="lg:object-cover lg:object-right"
        />
      </div>
    </section>
  );
};

export default Hero;
