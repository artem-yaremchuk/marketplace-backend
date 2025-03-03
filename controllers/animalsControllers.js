import HttpError from "../helpers/HttpError.js";
import catchAsync from "../helpers/catchAsync.js";
import { createAnimalSchema } from "../schemas/animalsSchemas.js";
import { createAnimalAd } from "../services/animalServices.js";
import removeFiles from "../helpers/removeFiles.js";

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
  if (error) throw HttpError(400, error.message);

  const {
    animalName,
    animalType,
    breed,
    age,
    gender,
    animalLocation,
    adTitle,
    adText,
    animalImages,
  } = await createAnimalAd(ownerId, value, req.files);

  res.status(200).json({
    animal: {
      animalName,
      animalType,
      breed,
      age,
      gender,
      animalLocation,
      adTitle,
      adText,
      animalImages,
      ownerName,
      ownerPhone,
    },
  });
});
