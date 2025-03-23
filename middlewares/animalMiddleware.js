import { ImageService } from "../services/imageService.js";
import dotenv from "dotenv";

dotenv.config();

const MAX_ANIMAL_IMAGES = Number(process.env.MAX_ANIMAL_IMAGES) || 4;

export const uploadAnimalImages = ImageService.initUploadImageMiddleware("images", MAX_ANIMAL_IMAGES);