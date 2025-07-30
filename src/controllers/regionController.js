import Region from "../models/regionModel.js";
import catchAsync from "../helpers/catchAsync.js";
import HttpError from "../helpers/HttpError.js";

export const getRegions = catchAsync(async (req, res) => {
  const regions = await Region.find({});

  if (!regions) throw HttpError(404, "Regions not found");

  res.status(200).json(regions);
});