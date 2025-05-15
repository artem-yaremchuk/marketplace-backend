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
import User from "../models/userModel.js";
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

  if (value.age.years === 0 && value.age.months === 0) {
    await removeFiles(req.files);
    throw HttpError(400, "Age cannot be 0 years and 0 months");
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

export const filterAnimals = catchAsync(async (req, res) => {
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

export const updateHiddenStatus = catchAsync(async (req, res) => {
  const { id: animalId } = req.params;
  const { _id: userId } = req.user;
  const { isHidden } = req.body;

  const updatedAnimal = await Animal.findOneAndUpdate(
    { _id: animalId, owner: userId },
    { isHidden },
    { new: true },
  );

  const { _id, ...rest } = updatedAnimal.toObject();

  res.status(200).json({
    message: isHidden ? "Animal has been hidden" : "Animal is now visible",
    animal: { id: _id, ...rest },
  });
});

export const getAnimalDetails = catchAsync(async (req, res) => {
  const { id: animalId } = req.params;

  const animal = await Animal.findById(animalId);

  const { owner } = animal;

  const { name: ownerName, phone: ownerPhone } = await User.findById(owner);

  const { _id, ...rest } = animal.toObject();

  res.status(200).json({
    animal: { id: _id, ...rest },
    ownerName,
    ownerPhone,
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

  if (value.age.years === 0 && value.age.months === 0) {
    await removeFiles(req.files);
    throw HttpError(400, "Age cannot be 0 years and 0 months");
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