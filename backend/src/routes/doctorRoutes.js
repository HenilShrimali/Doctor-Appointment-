import { Router } from "express";
import { doctorAuthMiddleware } from "../middleware/doctorMiddleware.js";
import { checkDoctorAuthController, doctorLoginController, doctorLogoutController, updateDoctorOwnProfileController } from "../controllers/doctor/authController.js";

const router = Router();

router.post("/login", doctorLoginController);
router.post("/logout", doctorLogoutController);
router.get("/check-auth", doctorAuthMiddleware, checkDoctorAuthController);
router.put("/update-profile", doctorAuthMiddleware, updateDoctorOwnProfileController);

export default router;