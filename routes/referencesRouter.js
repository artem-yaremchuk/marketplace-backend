import express from "express";
import animalTraitsRouter from "../routes/animalTraitsRouter.js";
import citiesRouter from "../routes/citiesRouter.js";
import statesRouter from "../routes/statesRouter.js";

const referencesRouter = express.Router();

referencesRouter.use("/animal-traits", animalTraitsRouter);
referencesRouter.use("/cities", citiesRouter);
referencesRouter.use("/states", statesRouter);

export default referencesRouter;