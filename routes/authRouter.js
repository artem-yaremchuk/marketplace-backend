import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema, verifyUserSchema, loginUserSchema, themeUserSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/userSchemas.js";
import {
  registerUser,
  verifyUser,
  reverifyUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserTheme,
  updateUser,
  deleteUser,
  requestResetPassword,
  confirmResetPassword,
  resetUserPassword,
} from "../controllers/authControllers.js";
import { authorization } from "../middlewares/authMiddleware.js";
import { uploadAvatar } from "../middlewares/userMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), registerUser);
authRouter.get("/verify/:verificationToken", verifyUser);
authRouter.post("/verify", validateBody(verifyUserSchema), reverifyUser);
authRouter.post("/login", validateBody(loginUserSchema), loginUser);
authRouter.post("/logout", authorization, logoutUser);
authRouter.get("/current", authorization, getCurrentUser);
authRouter.patch("/theme", authorization, validateBody(themeUserSchema), updateUserTheme);
authRouter.patch("/update", authorization, uploadAvatar, updateUser);
authRouter.delete("/delete", authorization, deleteUser);
authRouter.post("/forgot-password", validateBody(forgotPasswordSchema), requestResetPassword);
authRouter.get("/reset-password/:resetPasswordToken", confirmResetPassword);
authRouter.patch("/reset-password", authorization, validateBody(resetPasswordSchema), resetUserPassword);

export default authRouter;