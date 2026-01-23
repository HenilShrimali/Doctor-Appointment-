import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    specialization: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    phone: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "doctor",
    },
    bio: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const DOCTOR = mongoose.model("Doctor", doctorSchema);

export default DOCTOR;
