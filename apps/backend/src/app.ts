import express from "express";
import cors from "cors";
import "dotenv/config";
import "reflect-metadata";
import errorMiddleware from "./middlewares/errorMiddleware";
import { FRONTEND_URL, PORT } from "./constants/env";
import { catchError } from "./utils/catchError";
import { OK } from "./constants/http";
import noteRouter from "./routes/note.routes";
import { AppDataSource } from "./data/data-source";
import advancementRouter from "./routes/advancement.routes";
import docRouter from "./routes/docs.routes";
import impdimentRouter from "./routes/impediment.routes";
import institutionRouter from "./routes/institution.routes";
import teacherRouter from "./routes/teacher.routes";
import path from "path";
import fs from "fs";

const app = express();
// app.use(
//   cors({
//     origin: FRONTEND_URL,
//     credentials: true,
//   })
// );
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ensure upload folder exists
const uploadDir = path.join(process.cwd(), "documents");
fs.mkdirSync(uploadDir, { recursive: true });
// servir les fichiers uploadés publiquement sous /documents
app.use("/documents", express.static(path.join(process.cwd(), "documents")));

const uploadDirAdv = path.join(process.cwd(), "avancements");
fs.mkdirSync(uploadDirAdv, { recursive: true });
// servir les fichiers uploadés publiquement sous /avancements
app.use(
  "/avancements",
  express.static(path.join(process.cwd(), "avancements"))
);

const uploadDirImp = path.join(process.cwd(), "empechements");
fs.mkdirSync(uploadDirImp, { recursive: true });
// servir les fichiers uploadés publiquement sous /empechements
app.use(
  "/empechements",
  express.static(path.join(process.cwd(), "empechements"))
);

const uploadDirGlobale = path.join(process.cwd(), "globals");
fs.mkdirSync(uploadDirGlobale, { recursive: true });
// servir les fichiers uploadés publiquement sous /globals
app.use("/globals", express.static(path.join(process.cwd(), "globals")));

// Routes
app.use("/api/notes", noteRouter);
app.use("/api/advancements", advancementRouter);
app.use("/api/docs", docRouter);
app.use("/api/impediments", impdimentRouter);
app.use("/api/institutions", institutionRouter);
app.use("/api/teachers", teacherRouter);

app.get(
  "/health",
  catchError(async (req, res, next) => {
    return res.status(OK).json({
      status: "Health: OK",
    });
  })
);

app.use(errorMiddleware);

// Initialize Data Source and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

process.on("SIGINT", async () => {
  await AppDataSource.destroy();
  console.log("Data Source has been destroyed!");
  process.exit(0);
});
