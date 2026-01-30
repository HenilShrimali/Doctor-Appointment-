import {Router} from "express"
import { approveClinicController, getAllClinicsController, getAllDoctorsController, getAllUsersController, getPendingClinicsController, rejectClinicController } from "../../controllers/admin/adminControllers.js";

const router = Router();

router.get("/clinic/pending",getPendingClinicsController,);
router.put("/clinic/approve/:clinicId",approveClinicController,);
router.put("/clinic/reject/:clinicId",rejectClinicController,);
router.get("/users",getAllUsersController)
router.get("/clinic",getAllClinicsController)
router.get("/doctors",getAllDoctorsController)

export default router;