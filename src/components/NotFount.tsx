const NotFound = () => {
  return (
    <div className="mt-10 text-center">
      <h1 className="text-xl ">Page Not Found</h1>
      <p className="mt-5">
        <a
          href="/"
          className="border-b-[2px] border-accent-grey border-solid text-accent-grey"
        >
          Go To Home Page
        </a>
      </p>
    </div>
  );
};

export default NotFound;
