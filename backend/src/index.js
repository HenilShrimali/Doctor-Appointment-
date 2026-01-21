import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/dbConnection.js';
import userRoutes from './routes/userRoutes.js';
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/api/user",userRoutes)

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});