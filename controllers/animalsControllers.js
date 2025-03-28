import HttpError from "../helpers/HttpError.js";
import catchAsync from "../helpers/catchAsync.js";
import {
  createAnimalSchema,
  updateAnimalSchema,
} from "../schemas/animalsSchemas.js";
import {
  listActiveAnimals,
  createAnimalAd,
  updateFavorite,
  updateAnimalAd,
} from "../services/animalServices.js";
import removeFiles from "../helpers/removeFiles.js";

export const getAllActiveAnimals = catchAsync(async (req, res) => {
  const { total, animals } = await listActiveAnimals(req.query);

  const formattedAnimals = animals.map((animal) => {
    const { _id, ...rest } = animal.toObject();
    return { id: _id, ...rest };
  });

  res.status(200).json({ total, animals: formattedAnimals });
});

export const createAnimal = catchAsync(async (req, res) => {
  const { _id: ownerId, name: ownerName, phone: ownerPhone } = req.user;

  let animalData;

  if (!req.body.animalData) {
    removeFiles(req.files);
    throw HttpError(400, "Animal data required");
  }

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
  const { _id, ...rest } = newAnimal.toObject();

  res.status(200).json({
    newAnimal: { id: _id, ...rest },
    ownerName,
    ownerPhone,
  });
});

export const updateFavoriteStatus = catchAsync(async (req, res) => {
  const animalId = req.params.id;

  const updatedAnimal = await updateFavorite(animalId, req.body);

  const { _id, ...rest } = updatedAnimal.toObject();

  res.status(200).json({
    updatedAnimal: { id: _id, ...rest },
  });
});

export const updateAnimal = catchAsync(async (req, res) => {
  const { id: animalId } = req.params;

  let animalData;

  if (!req.body.animalData) {
    removeFiles(req.files);
    throw HttpError(400, "Animal data required");
  }

  try {
    animalData = JSON.parse(req.body.animalData);
  } catch {
    removeFiles(req.files);
    throw HttpError(400, "Invalid JSON format");
  }

  const { value, error } = updateAnimalSchema.validate(animalData);

  if (error) {
    removeFiles(req.files);
    throw HttpError(400, error.message);
  }

  const updatedAnimal = await updateAnimalAd(animalId, value, req.files);

  const { _id, ...rest } = updatedAnimal.toObject();

  res.status(200).json({
    updatedAnimal: { id: _id, ...rest },
  });
});
