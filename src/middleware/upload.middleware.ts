import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// use memory storage for tests
const storage =
  process.env.NODE_ENV === "test"
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      });

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
