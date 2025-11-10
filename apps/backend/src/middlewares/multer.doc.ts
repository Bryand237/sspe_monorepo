import multer from "multer";
import fs from "fs";
import path from "path";

// ensure upload folder exists
const uploadDir = path.join(process.cwd(), "globals");
fs.mkdirSync(uploadDir, { recursive: true });

// disk storage avec nom unique
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_.]/g, ""); // sanitize
    cb(null, `Global-${base}${ext}`);
  },
});

// filtre mime simple
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/docx",
    "application/pdf",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type"));
};

export const uploadGlobal = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
});
