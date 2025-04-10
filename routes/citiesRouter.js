import express from "express";
import { getCities } from "../controllers/cityController.js";

const citiesRouter = express.Router();

citiesRouter.get("/", getCities);

export default citiesRouter;