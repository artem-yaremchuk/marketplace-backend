import HttpError from "../helpers/HttpError.js";
import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import { checkToken } from "../services/jwtService.js";

export const authorization = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) throw HttpError(401, "Token is missing");
  
  const userId = checkToken(token);

  if (!userId) throw HttpError(401, "Invalid or expired token");

  const currentUser = await User.findById(userId);

  if (!currentUser) throw HttpError(401, "User associated with this token does not exist");

  req.user = currentUser;

  next();
});
