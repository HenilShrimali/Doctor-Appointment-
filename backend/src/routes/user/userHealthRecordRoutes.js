import {Router} from "express"
import { authMiddleware } from "../../middleware/userAuthMiddleware.js";
import { addFilesToRecordController, deleteFileFromRecordController, deleteHealthRecordController, getHealthRecordByIdController, getUserHealthRecordsController, updateHealthRecordController, uploadHealthRecordsController } from "../../controllers/user/healthRecordController.js";

const router = Router()

router.post("/", authMiddleware, uploadHealthRecordsController);
router.get("/", authMiddleware, getUserHealthRecordsController);
router.get("/:id", authMiddleware, getHealthRecordByIdController);
router.put("/:id", authMiddleware, updateHealthRecordController);
router.delete("/:id", authMiddleware, deleteHealthRecordController);

router.post("/:id/files", authMiddleware, addFilesToRecordController);
router.delete("/:recordId/files/:fileId", authMiddleware, deleteFileFromRecordController);

export default router