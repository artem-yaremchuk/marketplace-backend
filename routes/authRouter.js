import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema } from "../schemas/userSchemas.js";
import { registerUser } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), registerUser);

export default authRouter;