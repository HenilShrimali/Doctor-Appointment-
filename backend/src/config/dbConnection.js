import mongoose from "mongoose";

async function connectDB(uri) {
  return await mongoose.connect(uri);
}

export default connectDB;
