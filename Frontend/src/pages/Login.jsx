import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LoginImg from "../assets/login.jpg";
import { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | ScoreSaga";
  }, []);


  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(email)) errors.email = "Invalid email format";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Minimum 6 characters required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        setError("");
        navigate("/dashboard");
      } else {
        setError("Invalid login.");
      }
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image Section */}
      <div className="hidden md:block w-2/3">
        <img
          src={LoginImg}
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/3 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-600 mt-1">Welcome back! Please login to your account.</p>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              className={`w-full mt-1 px-4 py-2 rounded-md border ${
                fieldErrors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 ${
                fieldErrors.email ? "focus:ring-red-400" : "focus:ring-blue-500"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="text-sm text-gray-600">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full px-4 py-2 rounded-md border pr-10 ${
                  fieldErrors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 ${
                  fieldErrors.password ? "focus:ring-red-400" : "focus:ring-blue-500"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {fieldErrors.password && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Extra Options */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox text-blue-500" />
              <span>Remember Me</span>
            </label>
            <a href="#" className="hover:underline">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white py-2 rounded-md font-semibold transition"
          >
            Login
          </button>

          {/* General API Error */}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {/* Signup Redirect */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
