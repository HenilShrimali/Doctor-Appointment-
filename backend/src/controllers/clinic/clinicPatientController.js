import APPOINTMENT from "../../models/appointmentModel.js";
import USER from "../../models/userModel.js";
import DOCTOR from "../../models/doctorModel.js";

export const getClinicPatients = async (req, res) => {
  try {
    const { search } = req.query;

    const clinicDoctors = await DOCTOR.find({
      clinicId: req.clinic._id,
    }).select("_id");
    const doctorIds = clinicDoctors.map((doc) => doc._id);

    const appointments = await APPOINTMENT.find({
      doctorId: { $in: doctorIds },
    }).distinct("userId");

    let query = { _id: { $in: appointments } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const patients = await USER.find(query).select("-password");

    const patientsWithCount = await Promise.all(
      patients.map(async (patient) => {
        const totalAppointments = await APPOINTMENT.countDocuments({
          doctorId: { $in: doctorIds },
          userId: patient._id,
        });

        return {
          ...patient.toObject(),
          totalAppointments,
        };
      }),
    );

    patientsWithCount.sort((a, b) => b.totalAppointments - a.totalAppointments);

    res.status(200).json({
      success: true,
      count: patientsWithCount.length,
      data: patientsWithCount,
    });
  } catch (error) {
    console.error("Get clinic patients error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patients",
      error: error.message,
    });
  }
};

export const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const clinicDoctors = await DOCTOR.find({
      clinicId: req.clinic._id,
    }).select("_id");
    const doctorIds = clinicDoctors.map((doc) => doc._id);

    const appointments = await APPOINTMENT.find({
      doctorId: { $in: doctorIds },
      userId: patientId,
    })
      .populate(
        "userId",
        "name email phone profilePicture dateOfBirth bloodGroup",
      )
      .populate("doctorId", "name specialization experience")
      .populate("clinicId", "clinicName address city")
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get patient history error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient history",
      error: error.message,
    });
  }
};

export const getPatientDetails = async (req, res) => {
  try {
    const { patientId } = req.params;

    const clinicDoctors = await DOCTOR.find({
      clinicId: req.clinic._id,
    }).select("_id");
    const doctorIds = clinicDoctors.map((doc) => doc._id);

    const hasVisited = await APPOINTMENT.findOne({
      doctorId: { $in: doctorIds },
      userId: patientId,
    });

    if (!hasVisited) {
      return res.status(403).json({
        success: false,
        message: "This patient has not visited your clinic",
      });
    }

    const patient = await USER.findById(patientId).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const totalAppointments = await APPOINTMENT.countDocuments({
      doctorId: { $in: doctorIds },
      userId: patientId,
    });

    const lastConsultation = await APPOINTMENT.findOne({
      doctorId: { $in: doctorIds },
      userId: patientId,
    })
      .sort({ appointmentDate: -1 })
      .populate("doctorId", "name specialization");

    res.status(200).json({
      success: true,
      data: {
        ...patient.toObject(),
        totalAppointments,
        lastConsultation,
      },
    });
  } catch (error) {
    console.error("Get patient details error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient details",
      error: error.message,
    });
  }
};

export const getPatientStats = async (req, res) => {
  try {
    const clinicDoctors = await DOCTOR.find({
      clinicId: req.clinic._id,
    }).select("_id");
    const doctorIds = clinicDoctors.map((doc) => doc._id);

    const uniquePatients = await APPOINTMENT.find({
      doctorId: { $in: doctorIds },
    }).distinct("userId");

    const totalPatients = uniquePatients.length;

    const activePatients = await APPOINTMENT.find({
      doctorId: { $in: doctorIds },
      status: "completed",
    }).distinct("userId");

    const totalVisits = await APPOINTMENT.countDocuments({
      doctorId: { $in: doctorIds },
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newPatientsThisMonth = await APPOINTMENT.aggregate([
      {
        $match: {
          doctorId: { $in: doctorIds },
          appointmentDate: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: "$userId",
          firstVisit: { $min: "$appointmentDate" },
        },
      },
      {
        $match: {
          firstVisit: { $gte: startOfMonth },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        activePatients: activePatients.length,
        totalVisits,
        newThisMonth: newPatientsThisMonth.length,
        avgVisitsPerPatient:
          totalPatients > 0 ? (totalVisits / totalPatients).toFixed(1) : 0,
      },
    });
  } catch (error) {
    console.error("Get patient stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient statistics",
      error: error.message,
    });
  }
};
