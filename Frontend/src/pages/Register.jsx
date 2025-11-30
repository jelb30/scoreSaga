import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LoginImg from "../assets/Register.jpg";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    firstName: "",
    lastName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register | ScoreSaga";
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.username.trim()) errors.username = "Username is required";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) errors.email = "Invalid email format";

    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6) errors.password = "Minimum 6 characters";

    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
        const response = await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        });

        if (response.status === 200 && response.data === "User registered successfully.") {
        setError("");
        navigate("/home");
        } else {
        setError("Registration failed. Please try again.");
        }
    } catch (err) {
        setError("Registration failed. Please try again.");
        console.error(err);
    }
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div className="text-white space-y-5">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">ScoreSaga</p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Build your fantasy squad with the data edge.
          </h1>
          <p className="text-emerald-50/85 text-lg">
            Create your profile, sync fixtures, pin lineups, and never miss a winning pick. One dashboard to rule every match day.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-full border border-white/60 text-white hover:bg-white/10 transition"
            >
              Preview dashboard
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full bg-[#b7ff3b] text-black font-semibold shadow-lg shadow-black/30 hover:-translate-y-0.5 hover:brightness-95 transition"
              style={{ color: "#000" }}
            >
              I already have an account
            </Link>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl shadow-black/40 p-8">
          <div className="w-full space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-100/80">Get started</p>
              <h2 className="text-3xl font-semibold text-white mt-1">Create your ScoreSaga account</h2>
            </div>

            {/* First Name */}
            <InputField
              id="firstName"
              label="First Name"
              value={formData.firstName}
              error={fieldErrors.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />

            {/* Last Name */}
            <InputField
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              error={fieldErrors.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />

            {/* Username */}
            <InputField
              id="username"
              label="Username"
              value={formData.username}
              error={fieldErrors.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />

            {/* Email */}
            <InputField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              error={fieldErrors.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm text-emerald-50">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-emerald-100/60 border pr-12 ${
                    fieldErrors.password ? "border-red-400/80" : "border-white/20"
                  } focus:outline-none focus:ring-2 ${
                    fieldErrors.password ? "focus:ring-red-400" : "focus:ring-lime-300"
                  }`}
                  placeholder="Create a strong password"
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

            {/* Date of Birth */}
            <InputField
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              error={fieldErrors.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            />

            {/* Submit Button */}
            <button
              onClick={handleRegister}
              className="w-full text-black py-3 rounded-lg font-semibold transition duration-300 
               bg-[#b7ff3b]
               hover:brightness-95
               shadow-lg shadow-black/30"
              style={{ color: "#000" }}
            >
              Create account
            </button>

            {/* General Error */}
            {error && <p className="text-red-300 text-center text-sm">{error}</p>}

            {/* Redirect Link */}
            <p className="text-center text-sm text-emerald-50/85">
              Already have an account?{" "}
              <Link to="/login" className="text-lime-200 font-semibold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 👇 Reusable input field component
function InputField({ id, label, value, error, onChange, type = "text" }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-emerald-50">{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full mt-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-emerald-100/60 border ${
          error ? "border-red-400/80" : "border-white/20"
        } focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-400" : "focus:ring-lime-300"
        }`}
        />
      {error && <p className="text-sm text-red-300 mt-1">{error}</p>}
    </div>
  );
}
