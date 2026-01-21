import jwt from "jsonwebtoken";

export default function generateToken(user) {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
}
