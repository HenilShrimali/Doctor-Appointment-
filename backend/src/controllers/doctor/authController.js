import DOCTOR from "../../models/doctorModel.js";
import bcrypt from "bcrypt";
import  generateToken  from "../../utils/generateToken.js";

//For clinics
export const addDoctorController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      qualification,
      experience,
      phone,
      consultationFee,
      profilePicture,
      bio,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !qualification ||
      !experience ||
      !phone ||
      !consultationFee
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingDoctor = await DOCTOR.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await DOCTOR.create({
      name,
      email,
      password: hashedPassword,
      specialization,
      qualification,
      experience,
      phone,
      consultationFee,
      profilePicture: profilePicture || "",
      clinicId: req.clinic._id,
      bio: bio || "",
    });

    const doctorResponse = await DOCTOR.findById(doctor._id).select(
      "-password",
    );

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      data: doctorResponse,
    });
  } catch (error) {
    console.error("Error in addDoctor:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDoctorsController = async (req, res) => {
  try {
    const doctors = await DOCTOR.find({ clinicId: req.clinic._id })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Error in getDoctors:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDoctorController = async (req, res) => {
  try {
    const doctor = await DOCTOR.findOne({
      _id: req.params.id,
      clinicId: req.clinic._id,
    }).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Error in getDoctor:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateDoctorController = async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      qualification,
      experience,
      phone,
      consultationFee,
      profilePicture,
      bio,
      isActive,
    } = req.body;

    const doctor = await DOCTOR.findOne({
      _id: req.params.id,
      clinicId: req.clinic._id,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (email && email !== doctor.email) {
      const existingDoctor = await DOCTOR.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    if (name) doctor.name = name;
    if (email) doctor.email = email;
    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = experience;
    if (phone) doctor.phone = phone;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (profilePicture !== undefined) doctor.profilePicture = profilePicture;
    if (bio !== undefined) doctor.bio = bio;
    if (isActive !== undefined) doctor.isActive = isActive;

    await doctor.save();

    const updatedDoctor = await DOCTOR.findById(doctor._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error in updateDoctor:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const toggleDoctorStatusController = async (req, res) => {
  try {
    const doctor = await DOCTOR.findOne({
      _id: req.params.id,
      clinicId: req.clinic._id,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.isActive = !doctor.isActive;
    await doctor.save();

    const updatedDoctor = await DOCTOR.findById(doctor._id).select("-password");

    res.status(200).json({
      success: true,
      message: `Doctor ${doctor.isActive ? "activated" : "deactivated"} successfully`,
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error in toggleDoctorStatus:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//For doctors
export const doctorLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const doctor = await DOCTOR.findOne({ email }).select("+password");

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!doctor.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact the clinic.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    
    const doctorResponse = await DOCTOR.findById(doctor._id)
    .select("-password")
    .populate("clinicId", "clinicName city");

    
    const token =  generateToken(doctor._id, res);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.status(200).json({
      success: true,
      message: "Login successful",
      data: doctorResponse,
    });

  } catch (error) {
    console.error("Error in doctorLogin:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateDoctorOwnProfileController = async (req, res) => {
  try {
    const { name, phone, bio, languages, profilePicture } = req.body;

    const doctor = await DOCTOR.findById(req.doctor._id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (name) doctor.name = name;
    if (phone) doctor.phone = phone;
    if (bio !== undefined) doctor.bio = bio;
    if (languages) doctor.languages = languages;
    if (profilePicture !== undefined) doctor.profilePicture = profilePicture;

    await doctor.save();

    const updatedDoctor = await DOCTOR.findById(doctor._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error in updateDoctorOwnProfile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const doctorLogoutController= async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in doctorLogout:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const checkDoctorAuthController = async (req, res) => {
  try {
    const doctor = await DOCTOR.findById(req.doctor._id)
      .select("-password")
      .populate("clinicId", "clinicName city phone");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Error in checkDoctorAuth:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};