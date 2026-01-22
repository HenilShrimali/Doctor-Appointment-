import ClINIC from "../../models/clinicModel.js";
import USER from "../../models/userModel.js";

export const getPendingClinicsController = async (req, res) => {
  try {
    const clinics = await ClINIC.find({ status: "pending" });

    res.status(200).json({
      success: true,
      count: clinics.length,
      data: clinics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching clinic requests",
      error: error.message,
    });
  }
};

export const approveClinicController = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const clinic = await ClINIC.findByIdAndUpdate(
      clinicId,
      { status: "approved" },
      { new: true },
    );

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Clinic approved successfully",
      data: clinic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving clinic",
      error: error.message,
    });
  }
};

export const rejectClinicController = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const clinic = await ClINIC.findByIdAndUpdate(
      clinicId,
      { status: "rejected" },
      { new: true },
    );

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Clinic rejected",
      data: clinic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rejecting clinic",
      error: error.message,
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await USER.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const getAllClinicsController = async (req, res) => {
  try {
    const clinics = await ClINIC.find().select("-password");

    res.status(200).json({
      success: true,
      count: clinics.length,
      data: clinics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching clinics",
      error: error.message,
    });
  }
};