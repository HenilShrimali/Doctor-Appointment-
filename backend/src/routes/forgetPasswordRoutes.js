import {Router} from "express"
import { generatePasswordOtp, verifyPasswordOtp } from "../controllers/user/otpController.js"

const router = Router()

router.post("/generateOtp",generatePasswordOtp)
router.post("/verifyPasswordOtp",verifyPasswordOtp)

export default router