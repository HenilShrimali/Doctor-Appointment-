import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useClinicAuthStore } from "./store/clinicAuthStore";
import { axiosInstance } from "./api/api";

function ClinicChangePassword() {
  const navigate = useNavigate();
  const { clinic, updateClinicPassword } = useClinicAuthStore();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(clinic?.email || "");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axiosInstance.post(
        "/forgetPassword/generateOtp",
        {
          email,
          userType: "clinic",
        }
      );

      if (data.success) {
        toast.success(data.message);
        setStep(2);
        startTimer();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axiosInstance.post(
        "/forgetPassword/verifyPasswordOtp",
        {
          email,
          otp,
          userType: "clinic",
        }
      );

      if (data.success) {
        toast.success(data.message);
        setStep(3);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const res = await updateClinicPassword({
      email,
      newPassword,
      confirmPassword,
    });

    setIsLoading(false);

    if (res.success) {
      toast.success("Password changed successfully. Please login again.");
      navigate("/clinicLogin");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Clinic Password Reset
            </h1>
            <p className="text-emerald-100">
              {step === 1 && "Verify clinic email"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Set new password"}
            </p>
          </div>

          <div className="flex items-center justify-center px-6 py-6 border-b border-gray-200">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    step >= s
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      step > s ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-6">
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-6 text-black">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Clinic email"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <button
                  disabled={isLoading}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-6 text-black">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOTP(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 border rounded-lg text-center text-2xl"
                />
                <button
                  disabled={isLoading}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleChangePassword} className="space-y-6 text-black">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <button
                  disabled={isLoading}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg"
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-600"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClinicChangePassword;
