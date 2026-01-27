import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
} from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/userAuthMiddleware.js";

const router = express.Router();

router.get("/key", getRazorpayKey);
router.post("/create-order", authMiddleware, createRazorpayOrder);
router.post("/verify", authMiddleware, verifyRazorpayPayment);

export default router;
