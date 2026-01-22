import CLINIC from "../../models/clinicModel.js";
import bcrypt from "bcrypt";
import cloudinary from "../../utils/cloudinary.js";
import jwt from "jsonwebtoken";

export const clinicSignupController = async (req, res) => {
  try {
    const { clinicName, ownerName, email, phone, city, password } = req.body;

    const existing = await CLINIC.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Clinic already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const clinic = await CLINIC.create({
      clinicName,
      ownerName,
      email,
      phone,
      city,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Clinic registered. Await admin verification.",
      clinic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clinicLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const clinic = await CLINIC.findOne({ email }).select("+password");
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }    

    if (clinic.status !== "approved") {
      return res.status(403).json({
        message: "Clinic not verified by admin yet",
      });
    }

    if(clinic.status === "rejected"){
      return res.status(403).json({
        message: "Clinic registration rejected by admin",
      });
    }

     if (!clinic.isActive)
       return res.status(403).json({ message: "Clinic account is inactive" });

    const isMatch = await bcrypt.compare(password, clinic.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: clinic._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Clinic login successful",
      clinic: {
        _id: clinic._id,
        clinicName: clinic.clinicName,
        email: clinic.email,
        phone: clinic.phone,
        city: clinic.city,
        role: clinic.role,
        createdAt: clinic.createdAt,
        updatedAt: clinic.updatedAt,
        status: clinic.status,
        isActive: clinic.isActive,
        profilePicture: clinic.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clinicLogoutController = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Clinic logged out" });
};

export const updateClinicProfileController = async (req, res) => {
  try {
    const clinicId = req.clinic._id;
    const { clinicName, ownerName, email, phone, city } = req.body;

    const clinic = await CLINIC.findById(clinicId).select("-password");

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found",
      });
    }

    if (email && email !== clinic.email) {
      const emailExists = await CLINIC.findOne({
        email,
        _id: { $ne: clinicId },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another clinic",
        });
      }
    }

    if (phone && phone !== clinic.phone) {
      const phoneExists = await CLINIC.findOne({
        phone,
        _id: { $ne: clinicId },
      });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone already in use by another clinic",
        });
      }
    }

    if (phone && !/^[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone must be 10-15 digits",
      });
    }

    clinic.clinicName = clinicName || clinic.clinicName;
    clinic.ownerName = ownerName || clinic.ownerName;
    clinic.email = email || clinic.email;
    clinic.phone = phone || clinic.phone;
    clinic.city = city || clinic.city;

    await clinic.save();

    res.status(200).json({
      success: true,
      message: "Clinic profile updated successfully",
      data: clinic,
    });
  } catch (error) {
    console.error("Update clinic profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateClinicProfilePictureController = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const clinicId = req.clinic?._id;

    if (!profilePicture) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const clinic = await CLINIC.findById(clinicId).select("-password");
    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
      folder: "clinics/profile",
      resource_type: "image",
    });

    clinic.profilePicture = uploadResponse.secure_url;
    await clinic.save();

    res.status(200).json({
      success: true,
      message: "Clinic profile picture updated",
      data: clinic,
    });
  } catch (error) {
    console.error("Update clinic picture error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile picture",
      error: error.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const clinicId = req.clinic._id;
    const clinic = await CLINIC.findById(clinicId).select("-password");

    if (!clinic)
      res.status(404).json({
        message: "Clinic not found",
      });

    res.status(200).json({ data: clinic });
  } catch (error) {
    console.log(error.message, "Internal server error");
  }
};