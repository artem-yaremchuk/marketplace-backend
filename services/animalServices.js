import Animal from "../models/animalModel.js";
import cloudinary from "../helpers/cloudinary.js";
import HttpError from "../helpers/HttpError.js";
import removeFiles from "../helpers/removeFiles.js";

export const listActiveAnimals = async (query) => {
  const page = query.page ? +query.page : 1;
  const limit = query.limit ? +query.limit : 4;

  const docsToSkip = (page - 1) * limit;

  const animals = await Animal.find({ status: "active" })
    .sort({ createdAd: -1 })
    .skip(docsToSkip)
    .limit(limit);

  const total = await Animal.countDocuments();

  return { total, animals };
};

export const createAnimalAd = async (ownerId, animalData, files) => {
  let animalImages = [];

  try {
    if (files && files.length)
      for (const file of files) {
        {
          const uploadedImage = await cloudinary.uploader.upload(file.path, {
            folder: "animals",
          });

          const { public_id } = uploadedImage;

          const optimizedImageUrl = cloudinary.url(public_id, {
            fetch_format: "auto",
            quality: "auto:best",
            crop: "auto",
            gravity: "auto",
            width: 1000,
            height: 1000,
          });

          animalImages.push(optimizedImageUrl);

          await removeFiles(file);
        }
      }
  } catch (error) {
    throw HttpError(400, "Image upload failed");
  }

  if (animalImages.length === 0)
    throw HttpError(400, "At least 1 animal image is required");

  const newAnimal = await Animal.create({
    ...animalData,
    animalImages,
    owner: ownerId,
  });

  return newAnimal;
};

export const updateFavorite = async (animalId, favoriteStatus) => {
  const updatedAnimal = await Animal.findByIdAndUpdate(
    animalId,
    favoriteStatus,
    { new: true },
  );

  if (!updatedAnimal) {
    throw HttpError(404, "Animal not found");
  }

  return updatedAnimal;
};

export const updateAnimalAd = async (animalId, animalData, files) => {
  let animalImages = [];

  try {
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: "animals",
        });

        const { public_id } = uploadedImage;

        const optimizedImageUrl = cloudinary.url(public_id, {
          fetch_format: "auto",
          quality: "auto:best",
          crop: "auto",
          gravity: "auto",
          width: 1000,
          height: 1000,
        });

        animalImages.push(optimizedImageUrl);

        removeFiles(file);
      }
    }
  } catch {
    throw HttpError(400, "Image upload failed");
  }

  if (animalImages.length === 0)
    throw HttpError(400, "At least 1 animal image is required");

  const updatedAnimal = await Animal.findOneAndUpdate(
    { _id: animalId },
    { ...animalData, animalImages },
    { new: true },
  );

  return updatedAnimal;
};
