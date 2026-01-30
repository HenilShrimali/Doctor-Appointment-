import APPOINTMENT from "../../models/appointmentModel.js";
import DOCTOR from "../../models/doctorModel.js";

export const getClinicAppointments = async (req, res) => {
  try {
    const { status, doctorId, date } = req.query;

    const clinicDoctors = await DOCTOR.find({
      clinicId: req.clinic._id,
    }).select("_id");
    const doctorIds = clinicDoctors.map((doc) => doc._id);

    const filter = { doctorId: { $in: doctorIds } };

    if (status) {
      filter.status = status;
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
      .populate("userId", "name email phone profilePicture")
      .populate("doctorId", "name specialization experience qualification")
      .populate("clinicId", "clinicName")
      .sort({ appointmentDate: -1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get clinic appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

export const getAppointmentStats = async (req, res) => {
  try {
    const clinicDoctors = await DOCTOR.find({
      clinicId: req.clinic._id,
    }).select("_id");
    const doctorIds = clinicDoctors.map((doc) => doc._id);

    const filter = { doctorId: { $in: doctorIds } };

    const total = await APPOINTMENT.countDocuments(filter);

    const completed = await APPOINTMENT.countDocuments({
      ...filter,
      status: "completed",
    });

    const upcoming = await APPOINTMENT.countDocuments({
      ...filter,
      status: { $in: ["confirmed", "pending"] },
    });

    const cancelled = await APPOINTMENT.countDocuments({
      ...filter,
      status: "cancelled",
    });

    const revenueData = await APPOINTMENT.aggregate([
      {
        $match: {
          doctorId: { $in: doctorIds },
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
      ...filter,
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

export const getClinicAppointmentById = async (req, res) => {
  try {
    const clinicDoctors = await DOCTOR.find({
      clinicId: req.clinic._id,
    }).select("_id");
    const doctorIds = clinicDoctors.map((doc) => doc._id);

    const appointment = await APPOINTMENT.findOne({
      _id: req.params.id,
      doctorId: { $in: doctorIds },
    })
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

export const getAppointmentsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const clinicDoctors = await DOCTOR.find({
      clinicId: req.clinic._id,
    }).select("_id");
    const doctorIds = clinicDoctors.map((doc) => doc._id);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const appointments = await APPOINTMENT.find({
      doctorId: { $in: doctorIds },
      appointmentDate: {
        $gte: start,
        $lte: end,
      },
    })
      .populate("userId", "name email phone")
      .populate("doctorId", "name specialization")
      .sort({ appointmentDate: 1, startTime: 1 });

    const groupedByDate = appointments.reduce((acc, apt) => {
      const date = new Date(apt.appointmentDate).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(apt);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: groupedByDate,
    });
  } catch (error) {
    console.error("Get appointments by date range error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};
