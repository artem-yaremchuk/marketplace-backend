import User from "../models/userModel.js";
import formatAnimals from "./formatAnimals.js";

const getFormattedFavorites = async (userId) => {
  const userWithFavorites = await User.findById(userId).populate({
    path: "favorites",
    options: { sort: { createdAt: -1 } },
  });

  return formatAnimals(userWithFavorites.favorites);
};

export default getFormattedFavorites;