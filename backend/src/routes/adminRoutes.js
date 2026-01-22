import {Router} from "express"
import { approveClinicController, getAllClinicsController, getAllUsersController, getPendingClinicsController, rejectClinicController } from "../controllers/admin/adminControllers.js";

const router = Router();

router.get("/clinic/pending",getPendingClinicsController,);
router.put("/clinic/approve/:clinicId",approveClinicController,);
router.put("/clinic/reject/:clinicId",rejectClinicController,);
router.get("/users",getAllUsersController)
router.get("/clinic",getAllClinicsController)

export default router;