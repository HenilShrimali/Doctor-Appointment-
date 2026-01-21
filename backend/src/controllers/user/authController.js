import USER from "../../models/userModel.js";
import bcrypt from "bcrypt";
import { generateOtp } from "./otpController.js";

export const userSignupController = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, city, password, bloodGroup } =
      req.body;

    if (!name || !email || !phone || !dateOfBirth || !city || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const existingUser = await USER.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email or phone",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await USER.create({
      name,
      email,
      phone,
      dateOfBirth,
      city,
      password: hashedPassword,
      bloodGroup,
    });

    await generateOtp(user?._id);

    res.status(201).json({
      message: "Signup successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await USER.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await generateOtp(user?._id);

    res.status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const logoutController = async (req, res) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error in logging in user",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await USER.findById(userId);

    if (!user)
      res.status(404).json({
        message: "User not found",
      });

    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error.message, "Internal server error");
  }
};