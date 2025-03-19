import { ImageService } from "../services/imageService.js";

export const uploadAnimalImages = ImageService.initUploadImageMiddleware("images", 4);