import express from "express";
import { authorization } from "../middlewares/authMiddleware.js";
import { uploadAvatar } from "../middlewares/userMiddleware.js";
import { createAnimal } from "../controllers/animalsControllers.js";

const animalsRouter = express.Router();

animalsRouter.use(authorization);

animalsRouter.post("/", uploadAvatar, createAnimal);

export default animalsRouter;