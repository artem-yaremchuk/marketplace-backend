import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fse from "fs-extra";
import { v4 } from "uuid";
import HttpError from "../helpers/HttpError.js";

dotenv.config();

const MAX_IMAGE_SIZE = Number(process.env.MAX_IMAGE_SIZE) || 5;

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
      limits: { fileSize: MAX_IMAGE_SIZE * 1024 * 1024 },
    });

    if (maxCount === 1) {
      return upload.single(name);
    }

    return (req, res, next) => {
      // Create a middleware function to handle file uploads
      const handleUpload = upload.array(name, maxCount);

      // Invoke the Multer middleware, passing req, res, and a custom error handler
      handleUpload(req, res, (err) => {
        if (!err) {
          return next(); // If there is no error, pass control to the next middleware
        }

        // Check if the error is a MulterError and if it's related to the file limit
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_UNEXPECTED_FILE"
        ) {
          return next(
            HttpError(400, `Exceeded max image upload limit of ${maxCount}`),
          );
        }

       // Pass any other possible errors to the next middleware
        next(err);
      });
    };
  }
}