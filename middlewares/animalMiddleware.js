import dotenv from "dotenv";
import { ImageService } from "../services/imageService.js";
import catchAsync from "../helpers/catchAsync.js";
import { Types } from "mongoose";
import HttpError from "../helpers/HttpError.js";
import Animal from "../models/animalModel.js";

dotenv.config();

const MAX_ANIMAL_IMAGES = Number(process.env.MAX_ANIMAL_IMAGES) || 4;

export const uploadAnimalImages = ImageService.initUploadImageMiddleware(
  "images",
  MAX_ANIMAL_IMAGES,
);

export const checkAnimalId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const isIdValid = Types.ObjectId.isValid(id);

  if (!isIdValid) throw HttpError(400, "Animal id is not valid");

  const animalExists = await Animal.exists({ _id: id });

  if (!animalExists) throw HttpError(404, "Animal not found");

  next();
});

export const checkOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const owner = req.user._id;

  const animalExists = await Animal.exists({ _id: id, owner });

  if (!animalExists) throw HttpError(404, "Animal not found or you are not the owner");

  next();
});