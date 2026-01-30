import React, { useEffect, useState } from "react";
import OtpInput from "../../components/OtpInput.jsx";
import { useUserAuthStore } from "../../store/userAuthStore.js";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Shield, CheckCircle } from "lucide-react";

function VerifyOtp() {
  const [otp, setOtp] = useState([]);
  const { isUserAuthenticated, user, verifyUserOtp } = useUserAuthStore();
  const navigate = useNavigate();

  const handleVerification = async () => {
    console.log(user, otp);
    await verifyUserOtp(user?.id, otp);
  };

  const onOtpSubmit = (otpString) => {
    const digits = otpString.split("").map((digit) => Number(digit));
    setOtp(digits);
    console.log(digits, "otp");
  };

  useEffect(() => {
    if (user?.role === "admin" && isUserAuthenticated) {
      navigate("/admin/clinicRequests");
      return;
    }
    if (isUserAuthenticated) navigate("/userHome");
  }, [user, isUserAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 overflow-hidden">

      <div className="relative z-10 flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center justify-center mb-4 w-14 h-14 sm:w-16 sm:h-16 bg-teal-600 hover:scale-110 transition-all rounded-xl shadow-lg">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  Verify Your Account
                </h1>
                <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-md mx-auto">
                  We've sent a verification code to your email
                </p>
              </div>

              {user?.email && (
                <div className="mb-8 sm:mb-10 flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                  <span className="font-medium text-slate-700">{user.email}</span>
                </div>
              )}

              <div className="mb-8 sm:mb-10">
                <p className="text-center text-slate-700 font-medium mb-6 text-sm sm:text-base">
                  Enter the 6-digit code below
                </p>
                <div className="flex justify-center">
                  <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
                </div>
              </div>

              <button
                onClick={handleVerification}
                disabled={otp.length !== 6}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-sm sm:text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Verify Code
              </button>

              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-slate-600 text-xs sm:text-sm mb-2">
                  Didn't receive the code?
                </p>
                <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm sm:text-base hover:underline transition-colors">
                  Resend Code
                </button>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              
              <div className="relative bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl p-6 sm:p-8 shadow-xl">
                <img
                  src="/otp_logo.png"
                  alt="OTP Verification"
                  className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
                        <div class="text-center">
                          <div class="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full shadow-2xl mb-4">
                            <svg class="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                          </div>
                          <h3 class="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Secure Verification</h3>
                          <p class="text-slate-600 text-sm sm:text-base">Your account security is our priority</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>

              <div className="hidden lg:block absolute -left-8 top-1/4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-3 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Secure</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute -right-8 bottom-1/4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-3 animate-float animation-delay-2000">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Fast</p>
                    <p className="text-xs text-slate-600">Instant delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;