import jwt from "jsonwebtoken";
import Clinic from "../models/clinicModel.js";

export const clinicAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Clinic unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const clinic = await Clinic.findById(decoded._id).select("-password");
    if (!clinic) {
      return res.status(401).json({ message: "Clinic not found" });
    }

    req.clinic = clinic;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid clinic token" });
  }
};
