import express from "express";
import { authorization } from "../middlewares/authMiddleware.js";
import { uploadAnimalImages } from "../middlewares/animalMiddleware.js";
import { getAllAnimals, createAnimal } from "../controllers/animalsControllers.js";

const animalsRouter = express.Router();

animalsRouter.get("/", getAllAnimals);

animalsRouter.use(authorization);

animalsRouter.post("/", uploadAnimalImages, createAnimal);

export default animalsRouter;