import express from "express";
import { authorization } from "../middlewares/authMiddleware.js";
import {
  uploadAnimalImages,
  checkOwner,
  checkAnimalId,
} from "../middlewares/animalMiddleware.js";
import {
  createAnimal,
  getAllActiveAnimals,
  filterAnimals,
  getUserProfileAnimals,
  getAnimalDetails,
  updateFavoriteStatus,
  updateAnimal,
  deleteAnimal,
} from "../controllers/animalController.js";
import validateBody from "../helpers/validateBody.js";
import { updateFavoriteStatusSchema } from "../schemas/animalSchema.js";

const animalsRouter = express.Router();

animalsRouter.post("/", authorization, uploadAnimalImages, createAnimal);
animalsRouter.get("/", getAllActiveAnimals);
animalsRouter.get("/filter", filterAnimals);
animalsRouter.get("/my-animals", authorization, getUserProfileAnimals);
animalsRouter.get("/:id", checkAnimalId, getAnimalDetails);
animalsRouter.patch(
  "/:id/favorite",
  authorization,
  checkAnimalId,
  validateBody(updateFavoriteStatusSchema),
  updateFavoriteStatus,
);
animalsRouter.put(
  "/:id",
  authorization,
  checkAnimalId,
  checkOwner,
  uploadAnimalImages,
  updateAnimal,
);
animalsRouter.delete(
  "/:id",
  authorization,
  checkAnimalId,
  checkOwner,
  deleteAnimal,
);

export default animalsRouter;
