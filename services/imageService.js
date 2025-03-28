import multer from "multer";
import path from "path";
import fse from "fs-extra";
import { v4 } from "uuid";
import HttpError from "../helpers/HttpError.js";

export class ImageService {
  static initUploadImageMiddleware(name, maxCount = 1) {
    const uploadDir = path.join(process.cwd(), "uploads");

    fse.ensureDir(uploadDir);

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const filename = `${v4()}-${file.originalname.replace(/\s+/g, "-").toLowerCase()}`;
        cb(null, filename);
      },
    });

    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

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
    });

    if (maxCount === 1) {
      return upload.single(name);
    }

    return (req, res, next) => {
      // Створюємо middleware-функцію для обробки завантаження файлів
      const handleUpload = upload.array(name, maxCount);

      // Викликаємо middleware Multer і передаємо йому req, res та кастомний обробник помилок
      handleUpload(req, res, (err) => {
        if (!err) {
          return next(); // Якщо помилки немає, передаємо управління далі
        }

        // Перевіряємо, чи помилка є MulterError і чи вона пов'язана з лімітом файлів
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_UNEXPECTED_FILE"
        ) {
          return next(
            HttpError(400, `Exceeded max image upload limit of ${maxCount}`),
          );
        }

        // Передаємо інші можливі помилки далі
        next(err);
      });
    };
  }
}