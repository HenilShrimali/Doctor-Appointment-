import {Router} from "express"
import { checkAuth, clinicLoginController, clinicLogoutController, clinicSignupController, updateClinicProfileController, updateClinicProfilePictureController } from "../../controllers/clinic/authController.js"
import { clinicAuthMiddleware } from "../../middleware/clinicAuthMiddleware.js"

const router = Router()

router.post("/signup", clinicSignupController)
router.post("/login", clinicLoginController)
router.post("/logout", clinicLogoutController)
router.get("/check-auth", clinicAuthMiddleware, checkAuth);
router.put("/updateProfile",clinicAuthMiddleware,updateClinicProfileController)
router.put("/updateProfilePicture",clinicAuthMiddleware,updateClinicProfilePictureController)

export default router