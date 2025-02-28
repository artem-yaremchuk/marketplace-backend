import Animal from "../models/animalModel.js";
import cloudinary from "../helpers/cloudinary.js";
import HttpError from "../helpers/HttpError.js";

export const createAnimalAd = async (ownerId, animalData, file) => {
  let animalAvatar = "";

  try {
    if (file) {
      const uploadedImage = await cloudinary.uploader.upload(file.path);
      const { public_id } = uploadedImage;

      const optimizedImageUrl = cloudinary.url(public_id, {
        fetch_format: "auto",
        quality: "auto",
        crop: "auto",
        gravity: "auto",
        width: 500,
        height: 500,
      });

      animalAvatar = optimizedImageUrl;
    }
  } catch (error) {
    throw HttpError(400, "Image upload failed");
  }

  const newAnimal = await Animal.create({ ...animalData, avatar: animalAvatar, owner: ownerId });

  return newAnimal;
};