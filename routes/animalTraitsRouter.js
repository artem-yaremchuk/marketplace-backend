import express from "express";
import { getAnimalTraits } from "../controllers/animalTraitsController.js";

const animalTraitsRouter = express.Router();

animalTraitsRouter.get("/", getAnimalTraits);

export default animalTraitsRouter;