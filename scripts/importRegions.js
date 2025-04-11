import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import Region from "../models/regionModel.js";

dotenv.config();

const importRegions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const dataPath = path.join(__dirname, "../data/regions.json");

    const data = fs.readFileSync(dataPath, "utf-8");
    const parsedData = JSON.parse(data);

    await Region.deleteMany();

    await Region.create(parsedData);

    console.log("Regions data successfuly imported");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importRegions();