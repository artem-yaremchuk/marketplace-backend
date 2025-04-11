import express from "express";
import { getStates } from "../controllers/stateController.js";

const statesRouter = express.Router();

statesRouter.get("/", getStates);

export default statesRouter;
