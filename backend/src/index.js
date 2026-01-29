import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/dbConnection.js';
import userRoutes from './routes/userRoutes.js';
import clinicRoutes from './routes/clinicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import clinicDoctorRoutes from './routes/clinicDoctorRoutes.js';
import doctorAuthRoutes from './routes/doctorRoutes.js';
import timeSlotRoutes from './routes/slotRoutes.js';
import paymentRoutes from './routes/paymentRoute.js';
import appointmentRoutes from './routes/appointmentRoute.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userHealthRecordsRoutes from './routes/userHealthRecordRoutes.js';
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

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});