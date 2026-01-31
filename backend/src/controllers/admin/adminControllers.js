import ClINIC from "../../models/clinicModel.js";
import USER from "../../models/userModel.js";
import DOCTOR from "../../models/doctorModel.js";
import APPOINTMENT from "../../models/appointmentModel.js";

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

export const getAllDoctorsController = async (req,res)=>{
  try {
    const doctors = await DOCTOR.find()
      .select("-password")
      .populate("clinicId", "clinicName city email phone ");

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
}

export const getAllAppointmentsController = async (req, res) => {
  try {
    const { status, clinicId, doctorId, date } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (clinicId) {
      filter.clinicId = clinicId;
    }

    if (doctorId) {
      filter.doctorId = doctorId;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.appointmentDate = {
        $gte: startOfDay,
        $lt: endOfDay,
      };
    }

    const appointments = await APPOINTMENT.find(filter)
      .populate(
        "userId",
        "name email phone profilePicture dateOfBirth bloodGroup",
      )
      .populate("doctorId", "name specialization experience qualification")
      .populate("clinicId", "clinicName address city phone email")
      .populate("slotId")
      .sort({ appointmentDate: -1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get all appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

export const getAppointmentStatsController = async (req, res) => {
  try {
    const total = await APPOINTMENT.countDocuments();

    const completed = await APPOINTMENT.countDocuments({
      status: "completed",
    });

    const upcoming = await APPOINTMENT.countDocuments({
      status: { $in: ["confirmed", "pending"] },
    });

    const cancelled = await APPOINTMENT.countDocuments({
      status: "cancelled",
    });

    const pending = await APPOINTMENT.countDocuments({
      status: "pending",
    });

    const revenueData = await APPOINTMENT.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0].total : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await APPOINTMENT.countDocuments({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        upcoming,
        cancelled,
        pending,
        revenue,
        today: todayAppointments,
      },
    });
  } catch (error) {
    console.error("Get appointment stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

export const getAppointmentByIdController = async (req, res) => {
  try {
    const appointment = await APPOINTMENT.findById(req.params.id)
      .populate(
        "userId",
        "name email phone profilePicture dateOfBirth bloodGroup",
      )
      .populate("doctorId", "name specialization experience qualification")
      .populate("clinicId", "clinicName address city phone email");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: error.message,
    });
  }
};
