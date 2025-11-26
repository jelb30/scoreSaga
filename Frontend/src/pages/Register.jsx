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
        navigate("/dashboard");
        } else {
        setError("Registration failed. Please try again.");
        }
    } catch (err) {
        setError("Registration failed. Please try again.");
        console.error(err);
    }
    };


  return (
    <div className="min-h-screen flex">
      {/* Left Image Section */}
      <div className="hidden md:block w-2/3">
        <img
          src={LoginImg}
          alt="Register Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/3 bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Register</h2>
            <p className="text-gray-600 mt-1">Create your ScoreSaga account</p>
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
            <label htmlFor="password" className="text-sm text-gray-600">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`w-full px-4 py-2 rounded-md border pr-10 ${
                  fieldErrors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 ${
                  fieldErrors.password ? "focus:ring-red-400" : "focus:ring-blue-500"
                }`}
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
            className="w-full text-white py-2 rounded-md font-semibold transition duration-300 
             bg-gradient-to-r from-cyan-500 via-teal-400 to-green-400
             hover:from-cyan-600 hover:via-teal-500 hover:to-green-500
             shadow-lg hover:shadow-xl"
          >
            Register
          </button>

          {/* General Error */}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {/* Redirect Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// 👇 Reusable input field component
function InputField({ id, label, value, error, onChange, type = "text" }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full mt-1 px-4 py-2 rounded-md border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-400" : "focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
