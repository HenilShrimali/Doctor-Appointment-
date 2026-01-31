import {Router} from "express"
import { approveClinicController, getAllAppointmentsController, getAllClinicsController, getAllDoctorsController, getAllUsersController, getAppointmentByIdController, getAppointmentStatsController, getPendingClinicsController, rejectClinicController } from "../../controllers/admin/adminControllers.js";

const router = Router();

router.get("/clinic/pending",getPendingClinicsController,);
router.put("/clinic/approve/:clinicId",approveClinicController,);
router.put("/clinic/reject/:clinicId",rejectClinicController,);
router.get("/users",getAllUsersController)
router.get("/clinic",getAllClinicsController)
router.get("/doctors",getAllDoctorsController)
router.get("/appointments", getAllAppointmentsController);
router.get("/appointments/stats", getAppointmentStatsController);
router.get("/appointments/:id", getAppointmentByIdController);

export default router;