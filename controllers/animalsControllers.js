import HttpError from "../helpers/HttpError.js";
import catchAsync from "../helpers/catchAsync.js";
import { createAnimalSchema } from "../schemas/animalsSchemas.js";
import { listAnimals, createAnimalAd } from "../services/animalServices.js";
import removeFiles from "../helpers/removeFiles.js";

export const getAllAnimals = catchAsync(async (req, res) => {
  const { total, animals } = await listAnimals(req.query);

  res.status(200).json({ total, animals });
});

export const createAnimal = catchAsync(async (req, res) => {
  const { _id: ownerId, name: ownerName, phone: ownerPhone } = req.user;

  let animalData = {};

  try {
    animalData = JSON.parse(req.body.animalData);
  } catch {
    await removeFiles(req.files);
    throw HttpError(400, "Invalid JSON format");
  }

  const { value, error } = createAnimalSchema.validate(animalData);
  if (error) {
    await removeFiles(req.files);
    throw HttpError(400, error.message);
  }

  const newAnimal = await createAnimalAd(ownerId, value, req.files);

  res.status(200).json({
    newAnimal,
    ownerName,
    ownerPhone
  });
});
