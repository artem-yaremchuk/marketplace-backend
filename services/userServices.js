import { v4 } from "uuid";
import User from "../models/userModel.js";
import HttpError from "../helpers/HttpError.js";
import { signToken } from "../services/jwtService.js";

export const signup = async (userData) => {
  const { email } = userData;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  userData.verificationToken = v4();

  const newUser = await User.create(userData);

  return newUser;
};

export const verify = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  if (!user) throw HttpError(404, "User not found");

  user.verificationToken = null;
  user.verify = true;
  user.token = signToken(user.id);

  await user.save();

  return user;
};

export const reverify = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user)
    throw HttpError(404, "No user registered with the provided email address");

  if (user.verify) throw HttpError(400, "Verification has already been passed");

  return user;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) throw HttpError(401, "Invalid email address");

  if (!user.verify) throw HttpError(401, "User is not verified");

  const isPasswordValid = await user.checkPassword(password, user.password);

  if (!isPasswordValid) throw HttpError(401, "Invalid password");

  const token = signToken(user.id);

  const loggedInUser = await User.findByIdAndUpdate(
    user.id,
    { token },
    { new: true },
  );

  return loggedInUser;
};
