import OTP from "../../models/otpModel.js";
import USER from "../../models/userModel.js";
import  sendOtp  from "../../utils/sendOtp.js";
import  generateToken  from "../../utils/generateToken.js";

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
      user,
      success: true,
    });

  } catch (error) {
    console.log(error.message, "Error in generating message");
    res.status(500).json({
      message: "Enable to verify otp",
    });
  }
};