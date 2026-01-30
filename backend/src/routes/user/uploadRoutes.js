import express from "express";
import {
  uploadFileController,
  uploadMultipleFilesController,
} from "../../controllers/uploadController.js";
import { authMiddleware } from "../../middleware/userAuthMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, uploadFileController);
router.post("/multiple", authMiddleware, uploadMultipleFilesController);

export default router;
