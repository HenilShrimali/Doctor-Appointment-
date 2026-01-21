import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:{
        type: String,
        required: [true, "Name is required"],
        trim: true, 
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^[0-9]{10,15}$/, "Please provide a valid phone number"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    bloodGroup: {
      type: String,
      enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "Unknown"],
      default: "Unknown",
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true },
);

const USER = mongoose.model('User', userSchema);

export default USER;
    