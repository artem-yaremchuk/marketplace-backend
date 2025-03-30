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
  updateFavoriteStatus,
  updateAnimal,
  deleteAnimal,
} from "../controllers/animalsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { updateFavoriteStatusSchema } from "../schemas/animalsSchemas.js";

const animalsRouter = express.Router();

animalsRouter.post("/", authorization, uploadAnimalImages, createAnimal);
animalsRouter.get("/", getAllActiveAnimals);
animalsRouter.patch(
  "/:id/favorite",
  authorization,
  checkAnimalId,
  checkOwner,
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
