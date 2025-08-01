import { v4 } from "uuid";
import User from "../models/userModel.js";
import HttpError from "../helpers/HttpError.js";
import { signToken } from "./jwtService.js";
import cloudinary from "../helpers/cloudinary.js";
import removeFiles from "../helpers/removeFiles.js";

export const signup = async (userData) => {
  const { email } = userData;
  const user = await User.findOne({ email });

  if (user) throw HttpError(409, "User with this email is already registered");

  userData.verificationToken = v4();

  const newUser = await User.create(userData);

  return newUser;
};

export const verify = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  if (!user) throw HttpError(404, "User not found or verification token has already been used");

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

  if (user.verify) throw HttpError(409, "User is already verified");

  return user;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) throw HttpError(401, "Invalid credentials");

  if (!user.verify) throw HttpError(403, "User is not verified");

  const isPasswordValid = await user.checkPassword(password, user.password);

  if (!isPasswordValid) throw HttpError(401, "Invalid credentials");

  const token = signToken(user.id);

  const loggedInUser = await User.findByIdAndUpdate(
    user.id,
    { token },
    { new: true },
  );

  return loggedInUser;
};

export const updateUserProfile = async (userId, userData, file) => {
  const user = await User.findById(userId);

  if (!user) throw HttpError(404, "User not found");

  try {
    if (file) {
      const uploadedImage = await cloudinary.uploader.upload(file.path, {
        folder: "users",
      });

      const { public_id } = uploadedImage;

      const optimizedImageUrl = cloudinary.url(public_id, {
        fetch_format: "auto",
        quality: "auto:best",
        crop: "auto",
        gravity: "auto",
        width: 500,
        height: 500,
      });

      user.avatarURL = optimizedImageUrl;
    }
  } catch (error) {
    throw HttpError(400, "Image upload failed");
  } finally {
    await removeFiles(file);
  }

  if (userData.email) {
    const { email } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) throw HttpError(409, "User with this email is already registered");
  }
  
  Object.assign(user, userData);

  await user.save();

  return user;
};

export const createResetPasswordCode = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw HttpError(404, "User not found");

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code

  user.resetPasswordCode = resetCode;

  user.resetPasswordExpires = Date.now() + 20 * 60 * 1000; // The code is valid for 20 minutes

  await user.save();

  return user;
};

export const verifyResetPasswordCode = async (resetPasswordCode) => {
  const user = await User.findOne({ resetPasswordCode });

 if (!user || user.resetPasswordExpires < Date.now()) {
    throw HttpError(400, "Invalid or expired reset password code");
  }

  user.resetPasswordCode = null;
  user.resetPasswordExpires = null;

  await user.save();

  return user;
};

export const resetPassword = async (userId, newPassword) => {
  const user = await User.findById(userId);

  if (!user) throw HttpError(404, "User not found");

  user.password = newPassword;

  user.token = signToken(user.id);

  await user.save();

  return user;
};

export const changePassword = async (userId, newPassword) => {
  const user = await User.findById(userId);

  if (!user) throw HttpError(404, "User not found");

  user.password = newPassword;

  await user.save();
};