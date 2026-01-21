import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Valid email is required";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("User login data:", {
        ...formData,
        password: "***",
      });
      // Redirect to dashboard
      // navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 overflow-y-auto">
      {/* Background Elements */}
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

      {/* Navigation */}
      <nav className="backdrop-blur-sm bg-white/30 border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-16 sm:h-20 md:h-24 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full bg-white/50 border rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm sm:text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500/30"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/30"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label className="block text-xs sm:text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-white/50 border rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-9 sm:pr-10 text-sm sm:text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500/30"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 sm:top-3.5 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base mt-6 sm:mt-8"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-gradient-to-br from-white via-blue-50 to-green-50 text-slate-600">
                New to DocTrek?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <button
            onClick={() => navigate("/userSignup")}
            className="w-full border-2 border-blue-300 hover:border-blue-500 text-blue-600 hover:text-blue-700 font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base hover:bg-blue-50"
          >
            Create Account
          </button>

        </div>
      </div>
    </div>
  );
}
