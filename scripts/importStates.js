import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import State from "../models/stateModel.js";

dotenv.config();

const importStates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const dataPath = path.join(__dirname, "../data/states.json");

    const data = fs.readFileSync(dataPath, "utf-8");
    const parsedData = JSON.parse(data);

    await State.deleteMany();

    await State.create(parsedData);

    console.log("States data successfuly imported");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importStates();