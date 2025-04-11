import express from "express";
import { getRegions } from "../controllers/regionController.js";

const regionsRouter = express.Router();

regionsRouter.get("/", getRegions);

export default regionsRouter;
