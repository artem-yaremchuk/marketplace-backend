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

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

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
    return upload.array(name, maxCount);
  }
}
