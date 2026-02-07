import OTP from "../../models/otpModel.js";
import USER from "../../models/userModel.js";
import sendOtp from "../../utils/sendOtp.js";
import CLINIC from "../../models/clinicModel.js";
import generateToken from "../../utils/generateToken.js";

export const generateOtp = async (userId) => {
  const user = await USER.findById(userId);
  if (!user) throw new Error("User not found");

  await OTP.deleteMany({ userId });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.create({ userId, otp, expiresAt });

  await sendOtp(user.email, otp);

  return otp;
};

export const verifyOtpController = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        message: "UserId and Otp is required",
      });
    }

    const otpToken = await OTP.findOne({ userId });
    if (!otpToken) {
      return res.status(404).json({
        message: "Otp not found or expired",
      });
    }

    if (otpToken.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpToken._id });
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (otpToken.otp !== otp) {
      return res.status(400).json({
        message: "Invalid otp",
      });
    }

    await otpToken.save();

    const user = await USER.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.save();

    const token = generateToken(user);

    const cookieOptions = {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions).status(200).json({
      message: "OTP Verified successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    console.log(error.message, "Error in generating message");
    res.status(500).json({
      message: "Enable to verify otp",
    });
  }
};

export const generatePasswordOtp = async (req, res) => {
  try {
    const { email, userType } = req.body;

    if (!email || !userType) {
      return res.status(400).json({
        success: false,
        message: "Email and user type are required",
      });
    }

    let account;

    if (userType === "user") {
      account = await USER.findOne({ email });
    } else if (userType === "clinic") {
      account = await CLINIC.findOne({ email });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: `${userType} not found`,
      });
    }

    await OTP.deleteMany({ userId: account?._id });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ userId: account?._id, otp, expiresAt });

    await sendOtp(account?.email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error.message, "Error in generating OTP");
    res.status(500).json({
      success: false,
      message: "Unable to generate OTP",
    });
  }
};

export const verifyPasswordOtp = async (req, res) => {
  try {
    const { email, otp, userType } = req.body;

    if (!email || !otp || !userType) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and user type are required",
      });
    }

    let account;
    if (userType === "user") {
      account = await USER.findOne({ email });
    } else if (userType === "clinic") {
      account = await CLINIC.findOne({ email });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: `${userType} not found`,
      });
    }
    
    const otpToken = await OTP.findOne({
      userId:account?._id,
    });
    
    if (!otpToken) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or already used",
      });
    }

    if (otpToken.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpToken._id });
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (otpToken.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await OTP.deleteOne({ _id: otpToken._id });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying password OTP:", error);
    res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};