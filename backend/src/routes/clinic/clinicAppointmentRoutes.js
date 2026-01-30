import express from "express";
import {
  getClinicAppointments,
  getAppointmentStats,
  getClinicAppointmentById,
  getAppointmentsByDateRange,
} from "../../controllers/clinic/clinicAppointmentController.js";
import { clinicAuthMiddleware } from "../../middleware/clinicAuthMiddleware.js";

const router = express.Router();


router.get("/",clinicAuthMiddleware, getClinicAppointments);
router.get("/stats",clinicAuthMiddleware, getAppointmentStats);
router.get("/date-range",clinicAuthMiddleware, getAppointmentsByDateRange);
router.get("/:id",clinicAuthMiddleware, getClinicAppointmentById);

export default router;
