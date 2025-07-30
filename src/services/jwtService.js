import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES;

export const signToken = (id) => {
  const token = jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpiresIn });

  return token;
};

export const checkToken = (token) => {
  try {
    const { id } = jwt.verify(token, jwtSecret);
    return id;
  } catch (error) {
    return null;
  }
};
