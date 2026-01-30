import express from "express";
import { doctorAuthMiddleware } from "../../middleware/doctorMiddleware.js";
import { getDoctorPatientsController, getPatientDetailsController, getPatientHistoryController } from "../../controllers/doctor/patientController.js";

const router = express.Router();


router.get("/",doctorAuthMiddleware, getDoctorPatientsController);
router.get("/:patientId",doctorAuthMiddleware, getPatientDetailsController);
router.get("/:patientId/history",doctorAuthMiddleware, getPatientHistoryController);

export default router;