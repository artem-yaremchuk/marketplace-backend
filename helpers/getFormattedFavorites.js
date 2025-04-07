import User from "../models/userModel.js";

const getFormattedFavorites = async (userId) => {
  const userWithFavorites = await User.findById(userId).populate({
    path: "favorites",
    options: { sort: { createdAt: -1 } },
  });

  return userWithFavorites.favorites.map((animal) => {
    const { _id, ...rest } = animal.toObject();
    return { id: _id, ...rest };
  });
};

export default getFormattedFavorites;