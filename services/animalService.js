import Animal from "../models/animalModel.js";
import AnimalTrait from "../models/animalTraitModel.js";
import User from "../models/userModel.js";
import cloudinary from "../helpers/cloudinary.js";
import HttpError from "../helpers/HttpError.js";
import removeFiles from "../helpers/removeFiles.js";

export const createAnimalAd = async (ownerId, animalData, files) => {
  let animalImages = [];
  let searchedTraits = null;

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

  animalData.animalType = animalData.animalType.toLowerCase();

  const { animalType, breed } = animalData;

  const animalsTraits = await AnimalTrait.findOne();

  if (
    animalsTraits &&
    animalsTraits[animalType] &&
    Array.isArray(animalsTraits[animalType])
  ) {
    searchedTraits = animalsTraits[animalType].find(
      (trait) => trait.breed === breed,
    );
  }

  if (searchedTraits) {
    const { size, weight, coat } = searchedTraits;
    animalData.size = size;
    animalData.weight = weight;
    animalData.coat = coat;
  } else {
    console.log(
      `No specific traits found for the animalType: "${animalType}" and breed: "${breed}"`,
    );
  }

  const newAnimal = await Animal.create({
    ...animalData,
    animalImages,
    owner: ownerId,
  });

  return newAnimal;
};

export const listActiveAnimals = async (query) => {
  const page = query.page ? +query.page : 1;
  const limit = query.limit ? +query.limit : 4;

  const docsToSkip = (page - 1) * limit;

  const animals = await Animal.find({ status: "active" })
    .sort({ createdAt: -1 })
    .skip(docsToSkip)
    .limit(limit);

  const total = await Animal.countDocuments({ status: "active" });

  return { total, animals };
};

export const getFilteredAnimals = async (query) => {
  const { animalType, gender, breed, location, age, size, sortByDate } = query;

  const page = query.page ? +query.page : 1;
  const limit = query.limit ? +query.limit : 12;

  const docsToSkip = (page - 1) * limit;

  const filter = { status: "active" };

  if (animalType) filter.animalType = animalType.toLowerCase();
  if (gender) filter.gender = gender;
  if (breed) filter.breed = breed;
  if (location) filter.animalLocation = location;
  if (size) filter.size = size;

  if (age) {
    const ageFilter = age;

    switch (ageFilter) {
      case "до 1 року":
        filter["age.years"] = 0;
        break;
      case "1-3 роки":
        filter["age.years"] = { $gte: 1, $lt: 3 };
        break;

      case "3-5 років":
        filter["age.years"] = { $gte: 3, $lt: 5 };
        break;
      case "Старше 5 років":
        filter["age.years"] = { $gte: 5 };
        break;
    }
  }

  const sortOption = sortByDate === "oldest" ? 1 : -1;

  const animals = await Animal.find(filter)
    .sort({ createdAt: sortOption })
    .skip(docsToSkip)
    .limit(limit);

  const total = await Animal.countDocuments(filter);

  return { total, animals };
};

export const listUserAnimals = async (owner, query) => {
  const { animalType, gender, breed, age, size, status, sortByDate } = query;

  const page = query.page ? +query.page : 1;
  const limit = query.limit ? +query.limit : 9;

  const docsToSkip = (page - 1) * limit;

  const filter = { owner };

  if (animalType) filter.animalType = animalType.toLowerCase();
  if (gender) filter.gender = gender;
  if (breed) filter.breed = breed;
  if (size) filter.size = size;

  if (age) {
    const ageFilter = age;

    switch (ageFilter) {
      case "до 1 року":
        filter["age.years"] = 0;
        break;
      case "1-3 роки":
        filter["age.years"] = { $gte: 1, $lt: 3 };
        break;

      case "3-5 років":
        filter["age.years"] = { $gte: 3, $lt: 5 };
        break;
      case "Старше 5 років":
        filter["age.years"] = { $gte: 5 };
        break;
    }
  }

  const sortOption = sortByDate === "oldest" ? 1 : -1;

  const animals = await Animal.find(filter)
    .sort({ createdAt: sortOption })
    .skip(docsToSkip)
    .limit(limit);

  const total = await Animal.countDocuments(filter);

  return { total, animals };
};

export const updateFavorite = async (animalId, userId, favoriteStatus) => {
  const user = await User.findById(userId);

  const index = user.favorites.indexOf(animalId);

  if (favoriteStatus) {
    if (index === -1) {
      user.favorites.push(animalId);
    }
  } else {
    if (index !== -1) {
      user.favorites.splice(index, 1);
    }
  }

  await user.save();

  return user;
};

export const updateAnimalAd = async (animalId, animalData, files) => {
  let animalImages = [];
  let searchedTraits = null;

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

  animalData.animalType = animalData.animalType.toLowerCase();
  
  const { animalType, breed } = animalData;

  const animalsTraits = await AnimalTrait.findOne();

  if (
    animalsTraits &&
    animalsTraits[animalType] &&
    Array.isArray(animalsTraits[animalType])
  ) {
    searchedTraits = animalsTraits[animalType].find(
      (trait) => trait.breed === breed,
    );
  }

  if (searchedTraits) {
    const { size, weight, coat } = searchedTraits;
    animalData.size = size;
    animalData.weight = weight;
    animalData.coat = coat;
  } else {
    console.log(
      `No specific traits found for the animalType: "${animalType}" and breed: "${breed}"`,
    );
  }

  const updatedAnimal = await Animal.findOneAndUpdate(
    { _id: animalId },
    { ...animalData, animalImages },
    { new: true },
  );

  return updatedAnimal;
};