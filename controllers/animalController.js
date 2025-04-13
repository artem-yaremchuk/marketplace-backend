import HttpError from "../helpers/HttpError.js";
import catchAsync from "../helpers/catchAsync.js";
import {
  createAnimalSchema,
  updateAnimalSchema,
} from "../schemas/animalSchema.js";
import {
  createAnimalAd,
  listActiveAnimals,
  getFilteredAnimals,
  listUserAnimals,
  updateFavorite,
  updateAnimalAd,
} from "../services/animalService.js";
import removeFiles from "../helpers/removeFiles.js";
import Animal from "../models/animalModel.js";
import getFormattedFavorites from "../helpers/getFormattedFavorites.js";
import formatAnimals from "../helpers/formatAnimals.js";

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

  res.status(201).json({
    message: "Animal ad has been created",
    animal: { id: _id, ...rest },
    ownerName,
    ownerPhone,
  });
});

export const getAllActiveAnimals = catchAsync(async (req, res) => {
  const { total, animals } = await listActiveAnimals(req.query);

  const formattedAnimals = formatAnimals(animals);

  res.status(200).json({ total, animals: formattedAnimals });
});

export const filterAnimals = catchAsync(async(req, res) => {
  const { total, animals } = await getFilteredAnimals(req.query);

  const formattedAnimals = formatAnimals(animals);

  res.status(200).json({ total, animals: formattedAnimals });
});

export const getUserProfileAnimals = catchAsync(async (req, res) => {
  const { _id: owner } = req.user;

  const { total, animals } = await listUserAnimals(owner, req.query);

  const formattedAnimals = formatAnimals(animals);

  res.status(200).json({ total, animals: formattedAnimals });
});

export const updateFavoriteStatus = catchAsync(async (req, res) => {
  const { id: animalId } = req.params;
  const { _id: userId } = req.user;
  const { favorite } = req.body;

  await updateFavorite(animalId, userId, favorite);

  const formattedFavoriteAnimals = await getFormattedFavorites(userId);

  res.status(200).json({
    message: favorite
      ? "Animal has been added to user favorites list"
      : "Animal has been removed from user favorites list",
    favorites: formattedFavoriteAnimals,
  });
});

export const getAnimalDetails = catchAsync(async (req, res) => {
  const { id: animalId } = req.params;

  const animal = await Animal.findById(animalId);

  const { _id, ...rest } = animal.toObject();

  res.status(200).json({
    animal: { id: _id, ...rest },
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
    message: "Animal ad has been updated",
    animal: { id: _id, ...rest },
  });
});

export const deleteAnimal = catchAsync(async (req, res) => {
  const { id: animalId } = req.params;

  await Animal.findByIdAndDelete(animalId);

  res.status(204).json();
});
