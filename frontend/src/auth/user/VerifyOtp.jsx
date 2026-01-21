import React, { useEffect } from "react";
import OtpInput from "../../components/OtpInput.jsx";
import { useState } from "react";
import { useUserAuthStore } from "../../store/userAuthStore.js";

function VerifyOtp() {
  const [otp, setOtp] = useState([]);
  const {isUserAuthenticated, user,verifyUserOtp } = useUserAuthStore();
  

  const handleVerification = async () => {  
    console.log(user,otp);
      
    await verifyUserOtp(user?.id, otp);
  };

  const onOtpSubmit = (otpString) => {
    const digits = otpString.split("").map((digit) => Number(digit));
    setOtp(digits);
    console.log(digits, "otp");
  };

  useEffect(() => {
    if(isUserAuthenticated) navigate("/userHome");
    }, [user,isUserAuthenticated]);

  return (
    <div className="h-screen w-screen flex  flex-col lg:flex-row overflow-hidden">
      {/* {Left side} */}
      <div className=" flex flex-1/2 items-center justify-center flex-col">
        <h1 className="text-md md:text-2xl font-semibold">
          We have send the code verification to your email
        </h1>
        <p className="mt-6 text-lg">Enter it below to continue</p>
        <div className="mt-6">
          <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
        </div>
        <button
          onClick={handleVerification}
          className="mt-12 bg-purple-400 text-2xl font-bold text-white px-18  md:px-40 rounded-sm py-1 hover:bg-purple-300 hover:scale-95 transition-all "
        >
          Verify
        </button>
      </div>

      {/* {Right side} */}
      <div className="flex flex-1/2  items-center justify-center">
        <img src="/otp_icon.png" alt="otp verification" className="size-120" />
      </div>
    </div>
  );
}

export default VerifyOtp;
