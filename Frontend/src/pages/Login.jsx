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
        navigate("/home");
      } else {
        setError("Invalid login.");
      }
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-900"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=2400&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        <div className="text-white space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">ScoreSaga</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Log in and drop into your fantasy control room.
          </h1>
          <p className="text-emerald-50/85 text-lg">
            Cristiano’s iconic drive on repeat. Channel that energy to lock squads, get instant alerts,
            and own every match day.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-full bg-[#b7ff3b] text-black font-semibold shadow-lg shadow-black/40 hover:-translate-y-0.5 hover:brightness-95 transition"
              style={{ color: "#000" }}
            >
              Create free profile
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-full border border-white/60 text-white hover:bg-white/10 transition"
            >
              Back to dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl shadow-black/40 p-8">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-100/80">Welcome back</p>
              <h2 className="text-3xl font-semibold text-white mt-1">Login to ScoreSaga</h2>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="text-sm text-emerald-50">Email</label>
              <input
                type="email"
                id="email"
                className={`w-full mt-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-emerald-100/60 border ${
                  fieldErrors.email ? "border-red-400/80" : "border-white/20"
                } focus:outline-none focus:ring-2 ${
                  fieldErrors.email ? "focus:ring-red-400" : "focus:ring-lime-300"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-300 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="text-sm text-emerald-50">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-emerald-100/60 border pr-12 ${
                    fieldErrors.password ? "border-red-400/80" : "border-white/20"
                  } focus:outline-none focus:ring-2 ${
                    fieldErrors.password ? "focus:ring-red-400" : "focus:ring-lime-300"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <span
                  className="absolute right-3 top-3.5 cursor-pointer text-emerald-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {fieldErrors.password && (
                <p className="text-sm text-red-300 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Extra Options */}
            <div className="flex justify-between items-center text-sm text-emerald-50/80">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-lime-300" />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:underline">Forgot Password?</a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-[#b7ff3b] hover:brightness-95 text-black py-3 rounded-lg font-semibold transition shadow-lg shadow-black/30"
              style={{ color: "#000" }}
            >
              Login
            </button>

            {/* General API Error */}
            {error && <p className="text-red-300 text-center text-sm">{error}</p>}

            {/* Signup Redirect */}
            <p className="text-center text-sm text-emerald-50/85">
              Don’t have an account?{" "}
              <Link to="/register" className="text-lime-200 font-semibold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
