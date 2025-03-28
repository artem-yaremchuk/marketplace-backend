import express from "express";
import { authorization } from "../middlewares/authMiddleware.js";
import { uploadAnimalImages, checkOwner, checkAnimalId } from "../middlewares/animalMiddleware.js";
import {
  getAllActiveAnimals,
  createAnimal,
  updateFavoriteStatus,
  updateAnimal,
} from "../controllers/animalsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { updateFavoriteStatusSchema } from "../schemas/animalsSchemas.js";

const animalsRouter = express.Router();

animalsRouter.get("/", getAllActiveAnimals);
animalsRouter.post("/", authorization, uploadAnimalImages, createAnimal);
animalsRouter.patch(
  "/:id/favorite",
  authorization,
  checkAnimalId,
  checkOwner,
  validateBody(updateFavoriteStatusSchema),
  updateFavoriteStatus,
);
animalsRouter.put("/:id", authorization, checkOwner, uploadAnimalImages, updateAnimal);

export default animalsRouter;
