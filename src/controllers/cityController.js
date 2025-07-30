import City from "../models/cityModel.js";
import catchAsync from "../helpers/catchAsync.js";
import HttpError from "../helpers/HttpError.js";

export const getCities = catchAsync(async (req, res) => {
  const cities = await City.find({});

  if (!cities) throw HttpError(404, "Cities not found");

  res.status(200).json(cities);
});