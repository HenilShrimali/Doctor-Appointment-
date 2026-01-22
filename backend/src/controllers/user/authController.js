import USER from "../../models/userModel.js";
import bcrypt from "bcrypt";
import { generateOtp } from "./otpController.js";
import cloudinary from "../../utils/cloudinary.js";

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

export const updateUserProfileController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, phone, dateOfBirth, city, bloodGroup } = req.body;

    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email && email !== user.email) {
      const emailExists = await USER.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another user",
        });
      }
    }

    if (phone && phone !== user.phone) {
      const phoneExists = await USER.findOne({ phone, _id: { $ne: userId } });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already in use by another user",
        });
      }
    }

    if (phone && !/^[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number (10-15 digits)",
      });
    }

    const validBloodGroups = [
      "O+",
      "O-",
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "Unknown",
    ];
    if (bloodGroup && !validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood group",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.city = city || user.city;
    user.bloodGroup = bloodGroup || user.bloodGroup;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        city: user.city,
        bloodGroup: user.bloodGroup,
        profilePicture: user.profilePicture,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateUserProfilePictureController = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user?._id;

    if (!profilePicture) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
      folder: "users/profile",
      resource_type: "image",
    });

    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        city: updatedUser.city,
        bloodGroup: updatedUser.bloodGroup,
        profilePicture: updatedUser.profilePicture,
        isActive: updatedUser.isActive,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update user profile picture error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile picture",
      error: error.message,
    });
  }
};