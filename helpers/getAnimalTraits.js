import AnimalTrait from "../models/animalTraitModel.js";

let cachedAnimalTraits = null;

const getAnimalTraits = async () => {
  if (cachedAnimalTraits) return cachedAnimalTraits;

  cachedAnimalTraits = await AnimalTrait.findOne().lean().exec();
  return cachedAnimalTraits;
};

export default getAnimalTraits;