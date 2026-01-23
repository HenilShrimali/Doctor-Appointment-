import jwt from "jsonwebtoken";
import DOCTOR from "../models/doctorModel.js";

export const doctorAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Doctor unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const doctor = await DOCTOR.findById(decoded._id).select("-password");
    if (!doctor) {
      return res.status(401).json({ message: "Doctor not found" });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid doctor token" });
  }
};
