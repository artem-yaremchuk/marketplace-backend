import State from "../models/stateModel.js";
import catchAsync from "../helpers/catchAsync.js";
import HttpError from "../helpers/HttpError.js";

export const getStates = catchAsync(async (req, res) => {
  const states = await State.find({});

  if (!states) throw HttpError(404, "States not found");

  res.status(200).json(states);
});