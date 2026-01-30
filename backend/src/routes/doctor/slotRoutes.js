import { Router } from "express";
import {doctorAuthMiddleware} from "../../middleware/doctorMiddleware.js";
import { createBulkTimeSlots, createTimeSlot, deleteBulkTimeSlots, deleteTimeSlot, getScheduleStats, getTimeSlots, updateTimeSlot } from "../../controllers/doctor/slotController.js";

const router = Router();

router.get("/stats",doctorAuthMiddleware, getScheduleStats);
router.get("/",doctorAuthMiddleware, getTimeSlots);
router.post("/create",doctorAuthMiddleware, createTimeSlot);
router.post("/createBulk",doctorAuthMiddleware, createBulkTimeSlots);
router.put("/:slotId",doctorAuthMiddleware, updateTimeSlot);
router.delete("/:slotId",doctorAuthMiddleware, deleteTimeSlot);
router.delete("/bulk/date",doctorAuthMiddleware, deleteBulkTimeSlots);

export default router;