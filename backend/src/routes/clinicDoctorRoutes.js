import {Router} from "express";
import { addDoctorController, getDoctorController, getDoctorsController, toggleDoctorStatusController, updateDoctorController } from "../controllers/doctor/authController.js";
import { clinicAuthMiddleware } from "../middleware/clinicAuthMiddleware.js";

const router = Router();

router.post("/add", clinicAuthMiddleware, addDoctorController);
router.get("/getDoctors", clinicAuthMiddleware, getDoctorsController);
router.get("/:id", clinicAuthMiddleware, getDoctorController);
router.put("/:id", clinicAuthMiddleware, updateDoctorController);
router.patch("/:id/toggleStatus", clinicAuthMiddleware, toggleDoctorStatusController);

export default router;