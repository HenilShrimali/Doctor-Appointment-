import NOTIFICATION from "../models/notificationModel.js";
import USER from "../models/userModel.js";
import DOCTOR from "../models/doctorModel.js";
import CLINIC from "../models/clinicModel.js";
import { sendPushNotification } from "./firebaseService.js";

const getFCMToken = async (recipientType, recipientId) => {
  try {
    let recipient = null;

    switch (recipientType) {
      case "user":
        recipient = await USER.findById(recipientId).select("fcmToken");
        break;
      case "doctor":
        recipient = await DOCTOR.findById(recipientId).select("fcmToken");
        break;
      case "clinic":
        recipient = await CLINIC.findById(recipientId).select("fcmToken");
        break;
      default:
        console.log(`Unknown recipient type: ${recipientType}`);
        return null;
    }

    return recipient?.fcmToken || null;
  } catch (error) {
    console.error(`Error getting FCM token for ${recipientType}:`, error);
    return null;
  }
};

const createAndSendNotification = async ({
  recipientType,
  recipientId,
  title,
  message,
  type,
  icon = "bell",
  link = null,
  data = {},
}) => {
  try {
    const notification = await NOTIFICATION.create({
      recipientType,
      recipientId,
      title,
      message,
      type,
      icon,
      link,
      data,
      isRead: false,
    });

    console.log(`Notification saved to DB: ${title}`);

    const fcmToken = await getFCMToken(recipientType, recipientId);

    if (fcmToken) {
      await sendPushNotification(fcmToken, title, message, {
        notificationId: notification._id.toString(),
        type,
        link: link || "",
        recipientType,
        ...data,
      });
    } else {
      console.log(`No FCM token found for ${recipientType} ${recipientId}`);
    }

    return notification;
  } catch (error) {
    console.error("Error in createAndSendNotification:", error);
    throw error;
  }
};

export const notifyNewAppointment = async (appointment) => {
  try {
    const userId = appointment.userId._id || appointment.userId;
    const doctorId = appointment.doctorId._id || appointment.doctorId;
    const clinicId = appointment.clinicId._id || appointment.clinicId;

    const appointmentDate = new Date(
      appointment.appointmentDate,
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const startTime = appointment.startTime;
    const doctorName = appointment.doctorId.name;
    const patientName = appointment.userId.name;

    await createAndSendNotification({
      recipientType: "user",
      recipientId: userId,
      title: "Appointment Confirmed!",
      message: `Your appointment with Dr. ${doctorName} on ${appointmentDate} at ${startTime} is confirmed.`,
      type: "appointment_confirmed",
      icon: "check",
      link: "/myAppointments",
      data: {
        appointmentId: appointment._id.toString(),
        doctorName,
        date: appointmentDate,
        time: startTime,
        action: "appointment_confirmed",
      },
    });

    await createAndSendNotification({
      recipientType: "doctor",
      recipientId: doctorId,
      title: "New Appointment Booked!",
      message: `${patientName} has booked an appointment on ${appointmentDate} at ${startTime}.`,
      type: "new_appointment",
      icon: "calendar",
      link: "/doctorAppointments",
      data: {
        appointmentId: appointment._id.toString(),
        patientName,
        date: appointmentDate,
        time: startTime,
        action: "new_appointment",
      },
    });

    await createAndSendNotification({
      recipientType: "clinic",
      recipientId: clinicId,
      title: "New Appointment Booked!",
      message: `New appointment with Dr. ${doctorName} on ${appointmentDate} at ${startTime}.`,
      type: "new_appointment",
      icon: "calendar",
      link: "/clinicAppointments",
      data: {
        appointmentId: appointment._id.toString(),
        doctorName,
        patientName,
        date: appointmentDate,
        action: "new_appointment",
      },
    });

    console.log("New appointment notifications sent (user, doctor, clinic)");
  } catch (error) {
    console.error("Error notifying new appointment:", error);
  }
};

export const notifyAppointmentCancelled = async (appointment, cancelledBy) => {
  try {
    const userId = appointment.userId._id || appointment.userId;
    const doctorId = appointment.doctorId._id || appointment.doctorId;
    const clinicId = appointment.clinicId._id || appointment.clinicId;

    const appointmentDate = new Date(
      appointment.appointmentDate,
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const startTime = appointment.startTime;
    const doctorName = appointment.doctorId.name;
    const patientName = appointment.userId.name;

    if (cancelledBy !== "user") {
      await createAndSendNotification({
        recipientType: "user",
        recipientId: userId,
        title: "Appointment Cancelled",
        message: `Your appointment with Dr. ${doctorName} on ${appointmentDate} has been cancelled.`,
        type: "appointment_cancelled",
        icon: "x",
        link: "/userAppointments",
        data: {
          appointmentId: appointment._id.toString(),
          reason: appointment.cancellationReason || "No reason provided",
          action: "appointment_cancelled",
        },
      });
    }

    if (cancelledBy === "user") {
      await createAndSendNotification({
        recipientType: "doctor",
        recipientId: doctorId,
        title: "Appointment Cancelled",
        message: `${patientName} cancelled their appointment on ${appointmentDate} at ${startTime}.`,
        type: "appointment_cancelled",
        icon: "x",
        link: "/doctorAppointments",
        data: {
          appointmentId: appointment._id.toString(),
          patientName,
          action: "appointment_cancelled",
        },
      });
    }

    await createAndSendNotification({
      recipientType: "clinic",
      recipientId: clinicId,
      title: "Appointment Cancelled",
      message: `Appointment with Dr. ${doctorName} on ${appointmentDate} has been cancelled.`,
      type: "appointment_cancelled",
      icon: "x",
      link: "/clinicAppointments",
      data: {
        appointmentId: appointment._id.toString(),
        action: "appointment_cancelled",
      },
    });

    console.log("Cancellation notifications sent");
  } catch (error) {
    console.error("Error notifying cancellation:", error);
  }
};

export const notifyAppointmentReminder = async (appointment) => {
  try {
    const userId = appointment.userId._id || appointment.userId;
    const doctorName = appointment.doctorId.name;
    const startTime = appointment.startTime;

    await createAndSendNotification({
      recipientType: "user",
      recipientId: userId,
      title: "Appointment in 30 Minutes!",
      message: `Your appointment with Dr. ${doctorName} starts at ${startTime}. Please be ready!`,
      type: "appointment_reminder",
      icon: "clock",
      link: "/userAppointments",
      data: {
        appointmentId: appointment._id.toString(),
        doctorName,
        time: startTime,
        action: "appointment_reminder",
        minutesBefore: 30,
      },
    });

    console.log("30-minute reminder sent");
  } catch (error) {
    console.error("Error sending reminder:", error);
  }
};

export const notifyConsultationCompleted = async (appointment) => {
  try {
    const userId = appointment.userId._id || appointment.userId;
    const doctorName = appointment.doctorId.name;
    const hasPrescription =
      appointment.prescription && appointment.prescription.length > 0;

    await createAndSendNotification({
      recipientType: "user",
      recipientId: userId,
      title: "Consultation Completed",
      message: `Your consultation with Dr. ${doctorName} is complete. ${hasPrescription ? "Your prescription is ready!" : "Check your health records."}`,
      type: "prescription_ready",
      icon: "pill",
      link: "/userAppointments",
      data: {
        appointmentId: appointment._id.toString(),
        doctorName,
        hasPrescription,
        action: "consultation_completed",
      },
    });

    console.log("Consultation completion notification sent");
  } catch (error) {
    console.error("Error notifying completion:", error);
  }
};

export const notifyPaymentSuccess = async (appointment, amount) => {
  try {
    const userId = appointment.userId._id || appointment.userId;
    const doctorName = appointment.doctorId.name;

    await createAndSendNotification({
      recipientType: "user",
      recipientId: userId,
      title: "Payment Successful!",
      message: `Payment of ₹${amount} for your appointment with Dr. ${doctorName} was successful.`,
      type: "payment_success",
      icon: "dollar",
      link: "/userAppointments",
      data: {
        appointmentId: appointment._id.toString(),
        amount: amount.toString(),
        doctorName,
        action: "payment_success",
      },
    });

    console.log("Payment success notification sent");
  } catch (error) {
    console.error("Error notifying payment:", error);
  }
}

export const sendCustomNotification = async ({
  recipientType,
  recipientId,
  title,
  message,
  type = "general",
  icon = "bell",
  link = null,
  data = {},
}) => {
  try {
    await createAndSendNotification({
      recipientType,
      recipientId,
      title,
      message,
      type,
      icon,
      link,
      data,
    });

    console.log(" Custom notification sent");
  } catch (error) {
    console.error(" Error sending custom notification:", error);
  }
};

