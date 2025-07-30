import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import compression from "compression";

import authRouter from "./routes/authRouter.js";
import animalsRouter from "./routes/animalsRouter.js";
import referencesRouter from "./routes/referencesRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../swagger.json"), "utf-8")
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection successfull");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.use(compression());

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/users", authRouter);
app.use("/animals", animalsRouter);
app.use("/references", referencesRouter);
app.use("/feedback", feedbackRouter);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ message });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
