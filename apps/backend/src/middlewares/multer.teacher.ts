import multer from "multer";
import fs from "fs";
import path from "path";
import { BAD_REQUEST } from "../constants/http";

const uploadDir = path.join(process.cwd(), "documents");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const obj = req.body;
    const docName = `${obj.matricule}` || "default";
    const uploadPath = path.join(uploadDir, docName);

    // Creation du dossier si non existant
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const obj = req.body;
    const extension = path.extname(file.originalname);
    const name = path
      .basename(file.originalname, extension)
      .replace(/\s+/g, "-");
    const uniqueSuffix = `${new Date().toLocaleDateString()}-${obj.filename}-${
      obj.matricule
    }-${name}`;
    const filename = uniqueSuffix + extension;
    cb(null, filename);
  },
});

// Filtrage des type de fichiers
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/docx",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non supporté"));
  }
};

export const teacherUpload = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB
  },
  fileFilter,
});

// Middleware pour gerer les erreurs de Multer
export const handleMulterError = (
  error: any,
  req: any,
  res: any,
  next: any
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(BAD_REQUEST)
        .json({ success: false, error: "Fichier trop volumineux." });
    }
  }

  next(error);
};
