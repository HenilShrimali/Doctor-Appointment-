import express from "express";
import {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  cancelAppointment,
  getAvailableDoctors,
  getDoctorAvailableSlots,
} from "../../controllers/user/appointmentController.js";
import {authMiddleware} from "../../middleware/userAuthMiddleware.js"

const router = express.Router();


router.get("/doctors", authMiddleware, getAvailableDoctors);
router.get("/doctors/:doctorId/slots",authMiddleware, getDoctorAvailableSlots);
router.post("/",authMiddleware, createAppointment);
router.get("/",authMiddleware, getUserAppointments);
router.get("/:appointmentId", authMiddleware,getAppointmentById);
router.put("/:appointmentId/cancel",authMiddleware, cancelAppointment);

export default router;
