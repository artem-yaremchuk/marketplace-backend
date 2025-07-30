import express from "express";
import animalTraitsRouter from "../routes/animalTraitsRouter.js";
import citiesRouter from "../routes/citiesRouter.js";
import regionsRouter from "../routes/regionsRouter.js";

const referencesRouter = express.Router();

referencesRouter.use("/animal-traits", animalTraitsRouter);
referencesRouter.use("/cities", citiesRouter);
referencesRouter.use("/regions", regionsRouter);

export default referencesRouter;