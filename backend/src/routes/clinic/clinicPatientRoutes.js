import express from "express";
import {
  getClinicPatients,
  getPatientHistory,
  getPatientDetails,
  getPatientStats,
} from "../../controllers/clinic/clinicPatientController.js";
import { clinicAuthMiddleware } from "../../middleware/clinicAuthMiddleware.js";

const router = express.Router();

router.get("/",clinicAuthMiddleware, getClinicPatients);
router.get("/stats",clinicAuthMiddleware, getPatientStats);
router.get("/:patientId",clinicAuthMiddleware, getPatientDetails);
router.get("/:patientId/history",clinicAuthMiddleware, getPatientHistory);

export default router;