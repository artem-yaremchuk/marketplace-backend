import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema, verifyUserSchema } from "../schemas/userSchemas.js";
import {
  registerUser,
  verifyUser,
  reverifyUser,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), registerUser);
authRouter.get("/verify/:verificationToken", verifyUser);
authRouter.post("/verify", validateBody(verifyUserSchema), reverifyUser);

export default authRouter;