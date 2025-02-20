import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema, verifyUserSchema, loginUserSchema } from "../schemas/userSchemas.js";
import {
  registerUser,
  verifyUser,
  reverifyUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/authControllers.js";
import { authorization } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), registerUser);
authRouter.get("/verify/:verificationToken", verifyUser);
authRouter.post("/verify", validateBody(verifyUserSchema), reverifyUser);
authRouter.post("/login", validateBody(loginUserSchema), loginUser);
authRouter.post("/logout", authorization, logoutUser);
authRouter.get("/current", authorization, getCurrentUser);

export default authRouter;