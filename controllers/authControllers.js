import catchAsync from "../helpers/catchAsync.js";
import { signup } from "../services/userServices.js";
import { Email } from "../services/emailService.js";

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