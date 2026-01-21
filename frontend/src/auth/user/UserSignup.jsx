import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowLeft,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    city: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      console.log("User signup data:", formData);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          style={{ animationDuration: "8s", animationDelay: "2s" }}
        ></div>
      </div>

      <nav className="backdrop-blur-sm bg-white/40 border-b border-white/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 md:h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors text-xs sm:text-sm md:text-base px-3 py-2 rounded-lg hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-xl">
          <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center justify-center mb-4 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3">
                Create Account
              </h1>
              <p className="text-slate-600 text-sm sm:text-base md:text-lg">
                Join DocTrek to book appointments with healthcare professionals
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John"
                      className={`w-full bg-white border-2 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-900 placeholder-slate-400 transition-all duration-200 ${
                        errors.firstName
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : focusedField === "firstName"
                            ? "border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                      } focus:outline-none`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500"></span>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Doe"
                      className={`w-full bg-white border-2 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-900 placeholder-slate-400 transition-all duration-200 ${
                        errors.lastName
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : focusedField === "lastName"
                            ? "border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                      } focus:outline-none`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500"></span>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="john@example.com"
                    className={`w-full bg-white border-2 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-900 placeholder-slate-400 transition-all duration-200 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : focusedField === "email"
                          ? "border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                          : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                    } focus:outline-none`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="1548264859"
                    className={`w-full bg-white border-2 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-900 placeholder-slate-400 transition-all duration-200 ${
                      errors.phone
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : focusedField === "phone"
                          ? "border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                          : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                    } focus:outline-none`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500"></span>
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("dateOfBirth")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full bg-white border-2 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-900 transition-all duration-200 ${
                        errors.dateOfBirth
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : focusedField === "dateOfBirth"
                            ? "border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                      } focus:outline-none`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500"></span>
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("city")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="New York"
                      className={`w-full bg-white border-2 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-900 placeholder-slate-400 transition-all duration-200 ${
                        errors.city
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : focusedField === "city"
                            ? "border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                            : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                      } focus:outline-none`}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500"></span>
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className={`w-full bg-white border-2 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-11 sm:pr-12 text-sm sm:text-base text-slate-900 placeholder-slate-400 transition-all duration-200 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : focusedField === "password"
                          ? "border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                          : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-3.5 top-3 sm:top-3.5 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500"></span>
                    {errors.password}
                  </p>
                )}
                <p className="text-slate-500 text-xs mt-2">
                  At least 8 characters required
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-sm sm:text-base mt-8 sm:mt-10 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-200">
              <p className="text-center text-slate-600 text-xs sm:text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/userLogin")}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
