import { ImageService } from "../services/imageService.js";

export const uploadAvatar = ImageService.initUploadImageMiddleware("avatar");

