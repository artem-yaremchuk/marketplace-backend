import Animal from "../models/animalModel.js";
import cloudinary from "../helpers/cloudinary.js";
import HttpError from "../helpers/HttpError.js";
import removeFiles from "../helpers/removeFiles.js";

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

  const newAnimal = await Animal.create({
    ...animalData,
    animalImages,
    owner: ownerId,
  });

  return newAnimal;
};
