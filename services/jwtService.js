import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES;

export const signToken = (id) => {
  const token = jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpiresIn });

  return token;
};

export const checkToken = (token) => {
  if (!token) throw HttpError(401, "Not authorized");

  try {
    const { id } = jwt.verify(token, jwtSecret);

    return id;
  } catch (err) {
    throw HttpError(401, "Not authorized");
  }
};
