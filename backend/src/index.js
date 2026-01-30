import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/dbConnection.js';
import userRoutes from './routes/user/userRoutes.js';
import clinicRoutes from './routes/clinic/clinicRoutes.js';
import adminRoutes from './routes/user/adminRoutes.js';
import clinicDoctorRoutes from './routes/clinic/clinicDoctorRoutes.js';
import doctorAuthRoutes from './routes/doctor/doctorRoutes.js';
import timeSlotRoutes from './routes/doctor/slotRoutes.js';
import paymentRoutes from './routes/user/paymentRoute.js';
import appointmentRoutes from './routes/user/appointmentRoute.js';
import uploadRoutes from './routes/user/uploadRoutes.js';
import userHealthRecordsRoutes from './routes/user/userHealthRecordRoutes.js';
import doctorAppointmentRoutes from './routes/doctor/doctorAppointmentRoutes.js';
import doctorPatientRoutes from './routes/doctor/patientRoutes.js';
import clinicAppointmentRoutes from './routes/clinic/clinicAppointmentRoutes.js';
import clinicPatientsRoutes from './routes/clinic/clinicPatientRoutes.js';
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URL)
  .then(() => {
    console.log('CONNECTED TO DATABASE');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

//Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}))
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.use("/api/user",userRoutes)
app.use("/api/clinic",clinicRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/clinic/doctors", clinicDoctorRoutes);
app.use("/api/doctor", doctorAuthRoutes);
app.use("/api/doctor/slots", timeSlotRoutes);
app.use("/api/payment",paymentRoutes)
app.use("/api/appointment",appointmentRoutes)
app.use("/api/upload", uploadRoutes);
app.use("/api/healthRecords",userHealthRecordsRoutes)
app.use("/api/doctor/appointments",doctorAppointmentRoutes)
app.use("/api/doctor/patients",doctorPatientRoutes)
app.use("/api/clinic/appointments",clinicAppointmentRoutes)
app.use("/api/clinic/patients",clinicPatientsRoutes)

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});