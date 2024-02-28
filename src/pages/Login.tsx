import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="input-section max-w-[300px] h-screen mx-auto flex flex-col align-middle justify-center space-y-4">
      <h2 className="title">Login</h2>
      <form action="/" className="flex flex-col space-y-2">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" className="basic-input" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" className="basic-input" />
        <div className="text-gray-400 text-sm py-2">
          <div className="text-main-orange hover:font-bold">
            Forgot password?
          </div>
          <div>
            Not a member?
            <span className="text-blue-600 font-bold hover:text-blue-500">
              <Link to="/signup"> Sign up now!</Link>
            </span>
          </div>
        </div>
        <button className="btn-orange">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
