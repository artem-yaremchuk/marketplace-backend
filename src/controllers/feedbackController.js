import catchAsync from "../helpers/catchAsync.js";
import HttpError from "../helpers/HttpError.js";
import { Email } from "../services/emailService.js";

export const createFeedback = catchAsync(async (req, res) => {
  const { email, feedback } = req.body;

  const user = { email };

  const emailService = new Email(user);

  try {
    await emailService.sendUserFeedback(feedback);
  } catch {
    throw HttpError(500, "Failed to send user feedback message");
  }

  try {
    await emailService.sendSupportReply();
  } catch {
    throw HttpError(500, "Failed to send support reply message");
  }

  res.status(200).json({
    message: "Feedback email has been sent",
  });
});