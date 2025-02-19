import catchAsync from "../helpers/catchAsync.js";
import { signup, verify, reverify } from "../services/userServices.js";
import { Email } from "../services/emailService.js";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = catchAsync(async (req, res) => {
  const newUser = await signup(req.body);
  const { name, email, phone, userType, verificationToken } = newUser;

  try {
    const url = `${req.protocol}://${req.get("host")}/api/users/verify/${verificationToken}`;

    await new Email(newUser, url).sendVerification();
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({
    user: {
      name,
      email,
      phone,
      userType,
    },
  });
});

export const verifyUser = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;

  const verifiedUser = await verify(verificationToken);
  const { token, name, email, phone, userType } = verifiedUser;

  const redirectUrl = process.env.FRONTEND_VERIFICATION_URL;

  res.status(200).json({
    message: "Verification successful",
    token,
    redirectUrl,
    user: {
      name,
      email,
      phone,
      userType,
    },
  });
});

export const reverifyUser = catchAsync(async (req, res) => {
  const user = await reverify(req.body);

  const { verificationToken } = user;

  try {
    const url = `${req.protocol}://${req.get("host")}/api/users/verify/${verificationToken}`;

    await new Email(user, url).sendVerification();
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    message: "Verification email sent",
  });
});