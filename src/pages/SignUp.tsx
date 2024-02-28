const SignUp = () => {
  return (
    <div className="input-section max-w-[300px] md:max-w-[500px] h-screen mx-auto flex flex-col align-middle space-y-4">
      <h2 className="title">Sign Up</h2>
      <form action="/" className="flex flex-col space-y-2 pb-5">
        <label htmlFor="first-name">First Name</label>
        <input type="text" id="first-name" className="basic-input" />
        <label htmlFor="last-name">Last Name</label>
        <input type="text" id="last-name" className="basic-input" />
        <label htmlFor="nickname">Nickname</label>
        <input type="text" id="nickname" className="basic-input" />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" className="basic-input" />
        <label htmlFor="mobile">Mobile</label>
        <input type="phone" id="mobile" className="basic-input" />
        <div className="flex flex-col space-y-2 mb-3">
          <span>Address</span>
          <label htmlFor="street">Street</label>
          <input type="text" id="street" className="basic-input" />
          <label htmlFor="district">District</label>
          <input type="text" id="district" className="basic-input" />
          <label htmlFor="city">City</label>
          <input type="text" id="city" className="basic-input" />
          <label htmlFor="postal-code">Postal Code</label>
          <input type="text" id="postal-code" className="basic-input" />
          <label htmlFor="password1">Password</label>
          <input type="password" id="password1" className="basic-input" />
          <label htmlFor="password2">Confirm Password</label>
          <input type="password" id="password2" className="basic-input" />
        </div>
        <button className="btn-orange">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
