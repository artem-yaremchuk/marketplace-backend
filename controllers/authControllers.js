import dotenv from "dotenv";
import catchAsync from "../helpers/catchAsync.js";
import { signup, verify, reverify, login, updateUserProfile } from "../services/userServices.js";
import { Email } from "../services/emailService.js";
import User from "../models/userModel.js";
import { updateUserSchema } from "../schemas/userSchemas.js";
import HttpError from "../helpers/HttpError.js";

dotenv.config();

export const registerUser = catchAsync(async (req, res) => {
  const newUser = await signup(req.body);
  const { name, email, location, phone, userType, verificationToken } = newUser;

  try {
    const url = `${req.protocol}://${req.get("host")}/api/users/verify/${verificationToken}`;

    await new Email(newUser, url).sendVerification();
  } catch (err) {
    console.log("Failed to send verification email:", err);
  }

  res.status(201).json({
    user: {
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

  const verifiedUser = await verify(verificationToken);
  const { token, name, email, location, phone, userType } = verifiedUser;

  const redirectUrl = process.env.FRONTEND_VERIFICATION_URL;

  res.status(200).json({
    message: "Verification successful",
    token,
    redirectUrl,
    user: {
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

  const url = `${req.protocol}://${req.get("host")}/api/users/verify/${verificationToken}`;

  await new Email(user, url).sendVerification();

  res.status(200).json({
    message: "Verification email sent",
  });
});

export const loginUser = catchAsync(async (req, res) => {
  const { token, name, email, location, phone, userType, avatarURL, theme } = await login(
    req.body,
  );

  res.status(200).json({
    token,
    user: {
      name,
      email,
      location,
      phone,
      userType,
      avatarURL,
      theme,
    },
  });
});

export const logoutUser = catchAsync(async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).send();
});

export const getCurrentUser = catchAsync(async (req, res) => {
  const { name, email, location, phone, userType, avatarURL, theme } = req.user;

  res.status(200).json({
    user: {
      name,
      email,
      location,
      phone,
      userType,
      avatarURL,
      theme,
    },
  });
});

export const updateUserTheme = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { theme } = req.body;

  await User.findByIdAndUpdate( _id, req.body);

  res.status(200).json({
    message: "Theme successfully updated",
    theme,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const { _id } = req.user;

  let userData = {};

  if (req.body.userData) {
    try {
      userData = JSON.parse(req.body.userData);
    } catch {
      throw HttpError(400, "Invalid JSON format");
    }

    Object.keys(userData).forEach((key) => {
      if (userData[key] === "") {
        delete userData[key];
      }
    });

    if (Object.keys(userData).length > 0) {
      const { value, error } = updateUserSchema.validate(userData);
      if (error) throw HttpError(400, error.message);
      userData = value;
    }
  }

  const { name, email, location, phone, avatarURL } = await updateUserProfile(
    _id,
    userData,
    req.file,
  );

  res.status(200).json({
    message: "User profile has been updated",
    user: {
      name,
      email,
      location,
      phone,
      avatarURL,
    },
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndDelete(_id);

  res.status(204).send();
});

