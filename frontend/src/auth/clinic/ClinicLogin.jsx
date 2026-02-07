import React, { useState } from "react";
import { useClinicAuthStore } from "../../store/clinicAuthStore.js";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react";

function ClinicLogin() {
  const navigate = useNavigate();
  const { clinicLogin, isClinicLoggingIn } = useClinicAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await clinicLogin(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-4 rounded-full">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Clinic Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your clinic dashboard
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5 text-black">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="clinic@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <Link
                to={"/clinic/changePassword"}
                className="text-emerald-600 text-sm hover:underline"
              >
                Forget Password
              </Link>
            </div>

            <button
              type="submit"
              disabled={isClinicLoggingIn}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isClinicLoggingIn ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Logging in...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/clinicSignup"
                className="font-medium text-emerald-600 hover:text-emerald-700 transition"
              >
                Register your clinic
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClinicLogin;
