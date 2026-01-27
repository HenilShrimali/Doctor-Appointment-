import express from "express";
import {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  cancelAppointment,
  getAvailableDoctors,
  getDoctorAvailableSlots,
} from "../controllers/doctor/appointmentController.js";
import { doctorAuthMiddleware } from "../middleware/doctorMiddleware.js";

const router = express.Router();


router.get("/doctors", doctorAuthMiddleware, getAvailableDoctors);
router.get("/doctors/:doctorId/slots",doctorAuthMiddleware, getDoctorAvailableSlots);
router.post("/",doctorAuthMiddleware, createAppointment);
router.get("/",doctorAuthMiddleware, getUserAppointments);
router.get("/:appointmentId", doctorAuthMiddleware,getAppointmentById);
router.put("/:appointmentId/cancel",doctorAuthMiddleware, cancelAppointment);

export default router;
