import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import City from "../models/cityModel.js";

dotenv.config();

const importCities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const dataPath = path.join(__dirname, "../data/cities.json");
    
    const data = fs.readFileSync(dataPath, "utf-8");
    const parsedData = JSON.parse(data);

    await City.deleteMany();

    await City.create(parsedData);

    console.log("Cities data successfully imported");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importCities();