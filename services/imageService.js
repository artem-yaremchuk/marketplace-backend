import multer from "multer";
import path from "path";
import { v4 } from "uuid";
import HttpError from "../helpers/HttpError.js";
import fse from "fs-extra";
import sharp from "sharp";

export class ImageService {
  static initUploadImageMiddleware(name) {
    const uploadDir = path.join(process.cwd(), "uploads");

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const filename = `${v4()}-${file.originalname.replace(/\s+/g, "-").toLowerCase()}`;
        cb(null, filename);
      },
    });

    const allowedMimeTypes = ["image/jpeg", "image/png"];

    const multerFilter = (req, file, cb) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(HttpError(400, "Please, upload images only"), false);
      }
    };

    const upload = multer({
      storage: storage,
      fileFilter: multerFilter,
      limits: { fileSize: 3 * 1024 * 1024 },
    }).single(name);

    return upload;
  }

  static async saveImage(file, size, folder) {
    const storeImage = path.join(process.cwd(), "public", folder);

    await fse.ensureDir(storeImage);

    const newFilename = `${v4()}.jpeg`;
    const outputPath = path.join(storeImage, newFilename);

    try {
      const metadata = await sharp(file.path).metadata();
      if (metadata.width !== size.width || metadata.height !== size.height) {
        await sharp(file.path)
          .resize(size.width, size.height)
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toFile(outputPath);
      } else {
        await sharp(file.path).toFormat("jpeg").toFile(outputPath);
      }

      await fse.remove(file.path); // Якщо необхідно видалити тимчасовий файл
      const avatarURL = `/public/${folder}/${newFilename}`;
      return avatarURL;
    } catch {
      throw HttpError(500, "Error processing image");
    }
  }
}
