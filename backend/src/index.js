import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/dbConnection.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URL)
  .then(() => {
    console.log('CONNECTED TO DATABASE');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});