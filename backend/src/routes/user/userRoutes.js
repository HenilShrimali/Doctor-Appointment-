import {Router} from 'express';
import { checkAuth, logoutController, updateUserPasswordController, updateUserProfileController, updateUserProfilePictureController, userLoginController, userSignupController } from '../../controllers/user/authController.js';
import { verifyOtpController } from '../../controllers/user/otpController.js';
import { authMiddleware } from '../../middleware/userAuthMiddleware.js';

const router = Router();

router.post("/signup",userSignupController)
router.post("/login",userLoginController)
router.post("/verify", verifyOtpController);
router.post("/logout",logoutController)
router.get("/check-auth", authMiddleware, checkAuth);
router.put("/updateProfile",authMiddleware,updateUserProfileController);
router.put("/updateProfilePicture",authMiddleware,updateUserProfilePictureController);
router.put("/updatePassword",updateUserPasswordController)

export default router;