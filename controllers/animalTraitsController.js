import AnimalTraits from "../models/animalTraitsModel.js";
import catchAsync from "../helpers/catchAsync.js";
import HttpError from "../helpers/HttpError.js";

export const getAnimalTraits = catchAsync(async (req, res) => {
  const traits = await AnimalTraits.findOne();

  if (!traits) throw HttpError(404, "Animal traits not found");

  res.status(200).json(traits);
});