import multer from "multer";
import fs from "fs";
import path from "path";

// ensure upload folder exists
const uploadDir = path.join(process.cwd(), "avancements");
fs.mkdirSync(uploadDir, { recursive: true });

// disk storage avec nom unique
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const obj = req.body;
    const ext = path.extname(file.originalname);
    // const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    const name = `Avancement-${obj.startDate}-${obj.endDate}`;
    cb(null, `${new Date().toLocaleDateString()}-${name}${ext}`);
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
    "application/docx",
    "application/pdf",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type"));
};

export const uploadAdvancement = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
});
