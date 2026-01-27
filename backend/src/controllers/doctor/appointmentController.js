import APPOINTMENT from "../../models/appointmentModel.js";
import DOCTOR from "../../models/doctorModel.js";
import SLOT from "../../models/slotModel.js";
import CLINIC from "../../models/clinicModel.js";

export const createAppointment = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      doctorId,
      slotId,
      symptoms,
      notes,
      paymentId,
      orderId,
      paymentMethod,
    } = req.body;

    const slot = await SLOT.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Time slot not found",
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    if (!slot.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This slot is not available",
      });
    }

    const doctor = await DOCTOR.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointment = await APPOINTMENT.create({
      userId,
      doctorId,
      clinicId: slot.clinicId,
      slotId,
      appointmentDate: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      symptoms,
      notes,
      amount: doctor.consultationFee,
      paymentId,
      orderId,
      paymentMethod,
      paymentStatus: "paid",
      status: "confirmed",
    });

    slot.isBooked = true;
    slot.appointmentId = appointment._id;
    await slot.save();

    const populatedAppointment = await APPOINTMENT.findById(appointment._id)
      .populate("userId", "name email phone")
      .populate("doctorId", "name specialization qualification")
      .populate("clinicId", "clinicName city");

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: populatedAppointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    const appointments = await APPOINTMENT.find(filter)
      .populate("doctorId", "name specialization qualification profilePicture")
      .populate("clinicId", "clinicName city phone")
      .sort({ appointmentDate: -1, startTime: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { appointmentId } = req.params;

    const appointment = await APPOINTMENT.findOne({
      _id: appointmentId,
      userId,
    })
      .populate(
        "doctorId",
        "name specialization qualification profilePicture phone email",
      )
      .populate("clinicId", "clinicName city address phone email")
      .populate("userId", "name email phone dateOfBirth city bloodGroup");

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

export const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { appointmentId } = req.params;
    const { reason } = req.body;

    const appointment = await APPOINTMENT.findOne({
      _id: appointmentId,
      userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed appointment",
      });
    }

    appointment.status = "cancelled";
    appointment.cancelledBy = "user";
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();
    await appointment.save();

    const slot = await SLOT.findById(appointment.slotId);
    if (slot) {
      slot.isBooked = false;
      slot.appointmentId = null;
      await slot.save();
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling appointment",
      error: error.message,
    });
  }
};

export const getAvailableDoctors = async (req, res) => {
  try {
    const { specialization, city, date } = req.query;

    const filter = { isActive: true };

    if (specialization) {
      filter.specialization = { $regex: specialization, $options: "i" };
    }

    if (city) {
      const clinics = await CLINIC.find({
        city: { $regex: city, $options: "i" },
      }).select("_id");

      filter.clinicId = { $in: clinics.map((c) => c._id) };
    }

    const doctors = await DOCTOR.find(filter)
      .populate("clinicId", "clinicName city address phone")
      .select("-password")
      .lean();

    if (date) {
      const doctorsWithSlots = await Promise.all(
        doctors.map(async (doctor) => {
          const availableSlots = await SLOT.countDocuments({
            doctorId: doctor._id,
            date: new Date(date),
            isAvailable: true,
            isBooked: false,
          });

          return {
            ...doctor,
            availableSlotsCount: availableSlots,
          };
        }),
      );

      return res.status(200).json({
        success: true,
        count: doctorsWithSlots.length,
        data: doctorsWithSlots,
      });
    }

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

export const getDoctorAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const slots = await SLOT.find({
      doctorId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      isAvailable: true,
      isBooked: false,
    }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    console.error("Get slots error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available slots",
      error: error.message,
    });
  }
};
