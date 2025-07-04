import Animal from "../models/animalModel.js";

export const getRandomAnimals = async (count) => {
  return await Animal.aggregate([
    { $match: { status: "active", isHidden: false }},
    { $sample: { size: count }},
  ]);
};