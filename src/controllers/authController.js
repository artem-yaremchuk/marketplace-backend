import dotenv from "dotenv";
import catchAsync from "../helpers/catchAsync.js";
import {
  signup,
  verify,
  reverify,
  login,
  updateUserProfile,
  createResetPasswordCode,
  verifyResetPasswordCode,
  resetPassword,
  changePassword,
} from "../services/userService.js";
import { Email } from "../services/emailService.js";
import User from "../models/userModel.js";
import Animal from "../models/animalModel.js";
import DeletedUser from "../models/deletedUserModel.js";
import { updateUserSchema } from "../schemas/userSchema.js";
import HttpError from "../helpers/HttpError.js";
import removeFiles from "../helpers/removeFiles.js";
import getFormattedFavorites from "../helpers/getFormattedFavorites.js";

dotenv.config();

export const registerUser = catchAsync(async (req, res) => {
  const newUser = await signup(req.body);
  const {
    _id: id,
    name,
    email,
    location,
    phone,
    userType,
    verificationToken,
  } = newUser;

  const { FRONTEND_URL } = process.env;

  try {
    const url = `${FRONTEND_URL}/verify/${verificationToken}`;

    await new Email(newUser, { url }).sendVerification();
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }

  res.status(201).json({
    message: "User has been registered",
    user: {
      id,
      name,
      email,
      location,
      phone,
      userType,
    },
  });
});

export const verifyUser = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) throw HttpError(400, "Verification token is missing");

  const verifiedUser = await verify(verificationToken);
  const {
    token,
    _id: id,
    name,
    email,
    location,
    phone,
    userType,
  } = verifiedUser;

  res.status(200).json({
    message: "User has been verified",
    token,
    user: {
      id,
      name,
      email,
      location,
      phone,
      userType,
    },
  });
});

export const reverifyUser = catchAsync(async (req, res) => {
  const user = await reverify(req.body);

  const { verificationToken } = user;

  const { FRONTEND_URL } = process.env;

  const url = `${FRONTEND_URL}/verify/${verificationToken}`;

  await new Email(user, { url }).sendVerification();

  res.status(200).json({
    message: "Verification email has been sent",
  });
});

export const loginUser = catchAsync(async (req, res) => {
  const {
    token,
    _id: id,
    name,
    email,
    location,
    phone,
    userType,
    avatarURL,
    theme,
  } = await login(req.body);

  const favorites = await getFormattedFavorites(id);

  res.status(200).json({
    message: "User has been logged in",
    token,
    user: {
      id,
      name,
      email,
      location,
      phone,
      userType,
      avatarURL,
      theme,
      favorites,
    },
  });
});

export const logoutUser = catchAsync(async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).send();
});

export const getCurrentUser = catchAsync(async (req, res) => {
  const {
    _id: id,
    name,
    email,
    location,
    phone,
    userType,
    avatarURL,
    theme,
  } = req.user;

  const favorites = await getFormattedFavorites(id);

  res.status(200).json({
    user: {
      id,
      name,
      email,
      location,
      phone,
      userType,
      avatarURL,
      theme,
      favorites,
    },
  });
});

export const updateUserTheme = catchAsync(async (req, res) => {
  const { _id } = req.user;

  const { theme } = await User.findByIdAndUpdate(_id, req.body, { new: true })
    .lean()
    .exec();

  res.status(200).json({
    message: "User theme has been updated",
    theme,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;

  let userData = {};

  if (req.body.userData) {
    try {
      userData = JSON.parse(req.body.userData);
    } catch {
      await removeFiles(req.file);
      throw HttpError(400, "Invalid JSON format");
    }

    Object.keys(userData).forEach((key) => {
      if (
        userData[key] === "" &&
        userData[key] === null &&
        userData[key] === undefined
      ) {
        delete userData[key];
      }
    });

    if (Object.keys(userData).length > 0) {
      const { value, error } = updateUserSchema.validate(userData);
      if (error) throw HttpError(400, error.message);
      userData = value;
    }
  }

  const { name, email, location, phone, avatarURL } =
    await updateUserProfile(userId, userData, req.file);

  res.status(200).json({
    message: "User profile has been updated",
    user: {
      id: userId,
      name,
      email,
      location,
      phone,
      avatarURL,
    },
  });
});

export const requestResetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await createResetPasswordCode(email);

  try {
    await new Email(user).sendResetPasswordCode();
  } catch {
    throw HttpError(500, "Failed to send reset password code");
  }

  res.status(200).json({
    message: "Reset password code has been sent to your email",
  });
});

export const confirmResetPassword = catchAsync(async (req, res) => {
  const { resetPasswordCode } = req.body;

  const user = await verifyResetPasswordCode(resetPasswordCode);

  const { _id: id } = user;

  res.status(200).json({
    message: "Reset password verification successful",
    user: {
      id,
    },
  });
});

export const resetUserPassword = catchAsync(async (req, res) => {
  const { id: userId } = req.params;

  const { password: newPassword } = req.body;

  const user = await resetPassword(userId, newPassword);

  const {
    token,
    _id: id,
    name,
    email,
    location,
    phone,
    userType,
    avatarURL,
    theme,
  } = user;

  const favorites = await getFormattedFavorites(id);

  res.status(200).json({
    message: "User password has been updated",
    token,
    user: {
      id,
      name,
      email,
      location,
      phone,
      userType,
      avatarURL,
      theme,
      favorites,
    },
  });
});

export const changeUserPassword = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;

  const { newPassword } = req.body;

  await changePassword(userId, newPassword);

  res.status(200).json({
    message: "User password has been changed",
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  const { _id } = req.user;

  const userToDelete = await User.findById(_id).lean().exec();

  await Promise.all([
    DeletedUser.create({ userData: userToDelete }),
    User.findByIdAndDelete(_id),
    Animal.deleteMany({ owner: _id }),
  ]);

  res.status(204).send();
});