import {Router} from 'express';
import { userLoginController, userSignupController } from '../controllers/user/authController.js';
import { verifyOtpController } from '../controllers/user/otpController.js';

const router = Router();

router.post("/signup",userSignupController)
router.post("/login",userLoginController)
router.post("/verify", verifyOtpController);

export default router;