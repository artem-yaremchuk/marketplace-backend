import express from "express";
import validateBody from "../helpers/validateBody.js";
import { feedbackSchema } from "../schemas/feedbackSchema.js";
import { createFeedback } from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", validateBody(feedbackSchema), createFeedback);

export default feedbackRouter;