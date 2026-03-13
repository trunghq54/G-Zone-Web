import React, { useState } from "react";

interface ModernFormProps {
  onLogin: (email, password) => Promise<void>;
}

const ModernForm: React.FC<ModernFormProps> = ({ onLogin }) => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div
      className={`container relative overflow-hidden w-[768px] max-w-full min-h-[480px] rounded-3xl shadow-lg bg-white ${
        isActive ? "active" : ""
      }`}
    >
      {/* Sign-Up Form Container */}
      <div
        className={`form-container sign-up absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 opacity-0 z-10 ${
          isActive ? "transform translate-x-full opacity-100 z-20" : ""
        }`}
      >
        <form className="bg-white flex items-center justify-center flex-col px-10 h-full text-center">
          <h1 className="text-3xl font-bold text-black">Create Account</h1>
          <div className="my-5">
            <a
              href="#"
              className="border border-gray-300 rounded-full inline-flex justify-center items-center m-1 w-10 h-10"
            >
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a
              href="#"
              className="border border-gray-300 rounded-full inline-flex justify-center items-center m-1 w-10 h-10"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="border border-gray-300 rounded-full inline-flex justify-center items-center m-1 w-10 h-10"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="#"
              className="border border-gray-300 rounded-full inline-flex justify-center items-center m-1 w-10 h-10"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <span className="text-xs text-black">
            or use your email for registration
          </span>
          <input
            className="bg-gray-200 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            type="text"
            placeholder="Name"
          />
          <input
            className="bg-gray-200 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            type="email"
            placeholder="Email"
          />
          <input
            className="bg-gray-200 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            type="password"
            placeholder="Password"
          />
          <button className="bg-primary hover:bg-primary-hover text-white text-xs py-2.5 px-11 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer">
            Sign Up
          </button>
        </form>
      </div>

      {/* Sign-In Form Container */}
      <div
        className={`form-container sign-in absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-20 ${
          isActive ? "transform translate-x-full opacity-0" : "opacity-100"
        }`}
      >
        <form
          className="bg-white flex items-center justify-center flex-col px-10 h-full text-center"
          onSubmit={handleLoginSubmit}
        >
          <h1 className="text-3xl font-bold text-black">Sign In</h1>
          <div className="my-5">
            <a
              href="#"
              className="border border-gray-300 rounded-full inline-flex justify-center items-center m-1 w-10 h-10"
            >
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a
              href="#"
              className="border border-gray-300 rounded-full inline-flex justify-center items-center m-1 w-10 h-10"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="border border-gray-300 rounded-full inline-flex justify-center items-center m-1 w-10 h-10"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="#"
              className="border border-gray-300 rounded-full inline-flex justify-center items-center m-1 w-10 h-10"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <span className="text-xs text-black">or use your email password</span>
          <input
            className="bg-gray-200 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="bg-gray-200 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#" className="text-gray-700 text-sm no-underline my-4">
            Forget Your Password?
          </a>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-white text-xs py-2.5 px-11 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Toggle Overlay Container */}
      <div
        className={`toggle-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out rounded-l-[150px] z-[1000] ${
          isActive
            ? "transform -translate-x-full rounded-r-[150px] rounded-l-none"
            : ""
        }`}
      >
        <div
          className={`toggle bg-primary h-full text-white relative -left-full w-[200%] transform transition-all duration-600 ease-in-out ${
            isActive ? "transform translate-x-1/2" : "transform translate-x-0"
          }`}
        >
          {/* Left Toggle Panel (for Sign In) */}
          <div
            className={`toggle-panel absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transform transition-all duration-600 ease-in-out ${
              isActive ? "transform translate-x-0" : "transform -translate-x-[200%]"
            }`}
          >
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-sm leading-5 tracking-tight my-5">
              Already have an account? Sign in to continue where you left off.
            </p>
            <button
              className="bg-transparent border border-white text-white text-xs py-2.5 px-11 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer"
              id="login"
              onClick={handleLoginClick}
            >
              Sign In
            </button>
          </div>

          {/* Right Toggle Panel (for Sign Up) */}
          <div
            className={`toggle-panel absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 right-0 transform transition-all duration-600 ease-in-out ${
              isActive ? "transform translate-x-[200%]" : "transform translate-x-0"
            }`}
          >
            <h1 className="text-3xl font-bold">New Here?</h1>
            <p className="text-sm leading-5 tracking-tight my-5">
              Join us today! Register with your personal details to get
              started.
            </p>
            <button
              className="bg-transparent border border-white text-white text-xs py-2.5 px-11 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer"
              id="register"
              onClick={handleRegisterClick}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernForm;
