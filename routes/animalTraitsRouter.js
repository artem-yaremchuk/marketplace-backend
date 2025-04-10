import express from "express";
import { getAnimalTraits } from "../controllers/animalTraitController.js";

const animalTraitsRouter = express.Router();

animalTraitsRouter.get("/", getAnimalTraits);

export default animalTraitsRouter;