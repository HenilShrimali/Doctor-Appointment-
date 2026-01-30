import express from "express";
import {
  getDoctorAppointmentsController,
  getTodayAppointmentsController,
  getDoctorAppointmentByIdController,
  completeAppointmentController,
  cancelDoctorAppointmentController,
  updatePrescriptionController,
} from "../../controllers/doctor/doctorAppointmentController.js";
import { doctorAuthMiddleware } from "../../middleware/doctorMiddleware.js";

const router = express.Router();


router.get("/",doctorAuthMiddleware, getDoctorAppointmentsController);
router.get("/today",doctorAuthMiddleware, getTodayAppointmentsController);
router.get("/:id", doctorAuthMiddleware, getDoctorAppointmentByIdController);
router.put("/:id/complete", doctorAuthMiddleware, completeAppointmentController);
router.put("/:id/cancel", doctorAuthMiddleware, cancelDoctorAppointmentController);
router.put("/:id/prescription", doctorAuthMiddleware, updatePrescriptionController);
export default router;
