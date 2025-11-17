import { CREATED, OK } from "../constants/http";
import { Teacher } from "../entity/teacher";
import { DocService } from "../services/docs.service";
import { TeacherService } from "../services/teacher.service";
import { catchError } from "../utils/catchError";
import fs from "fs";
import path from "path";

export class TeacherController {
  private teacherService: TeacherService;
  private docService: DocService;

  constructor() {
    this.teacherService = new TeacherService();
    this.docService = new DocService();
  }

  getAllTeachersNumber = catchError(async (req, res) => {
    const number = await this.teacherService.getAllTeacherNumber();
    res.status(OK).json({
      success: true,
      number,
    });
  });

  // List files from documents/{matricule} for a given teacher
  getTeacherDocsFromFS = catchError(async (req, res) => {
    const id = req.params.id;
    const teacher = await this.teacherService.getTeacherById(id);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Enseignant introuvable" });
    }
    const matricule = (teacher as any).matricule as string;
    const baseDir = path.join(process.cwd(), "documents");
    const folder = path.join(baseDir, `${matricule}`.replace(/[\\/]/g, "_"));
    if (!fs.existsSync(folder)) {
      return res.status(200).json({ success: true, data: [] });
    }

    const files = fs.readdirSync(folder);
    const items = files.map((fname) => {
      const fpath = path.join(folder, fname);
      const stat = fs.statSync(fpath);
      const rel = `/documents/${matricule}/${fname}`;
      const abs = `${req.protocol}://${req.get("host")}${rel}`;
      return {
        docName: fname,
        docPath: abs,
        docsize: stat.size,
      };
    });

    res.status(200).json({ success: true, data: items });
  });

  getAllTeachers = catchError(async (req, res) => {
    const teachers = await this.teacherService.getAllTeacher();
    res.status(OK).json({
      success: true,
      data: teachers,
    });
  });

  getTeacherById = catchError(async (req, res) => {
    const id = req.params.id;
    const teacher = await this.teacherService.getTeacherById(id);
    res.status(OK).json({
      success: true,
      data: teacher,
    });
  });

  uploadTeacherDoc = catchError(async (req, res) => {
    const { teacherId, matricule } = req.body || {};
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Aucun fichier reçu" });
    }
    if (!teacherId || !matricule) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Champs requis manquants: teacherId et matricule",
        });
    }

    const docName = req.file.filename;
    // Build a public URL served by Express static middleware
    const publicRelativePath = `/documents/${matricule}/${docName}`;
    const absoluteUrl = `${req.protocol}://${req.get(
      "host"
    )}${publicRelativePath}`;

    const teacher = await this.teacherService.getTeacherById(teacherId);
    const size = Number(req.file.size) || 0;
    const newDoc = await this.docService.saveDoc({
      docName,
      docPath: absoluteUrl,
      docsize: size,
      teacher: teacher ?? undefined,
    });
    res.status(CREATED).json({
      success: true,
      message: "Ficher uploadé avec succès.",
      newDoc,
    });
  });

  createTeacher = catchError(async (req, res) => {
    const {
      matricule,
      firstname,
      lastAdvancementDate,
      lastDiploma,
      lastname,
      sex,
      hireDate,
      phone,
      email,
      institution,
      grade,
      cei,
      functions,
      birthdate,
      nextAdvancementDate,
      nextCei,
      nextGrade,
      statut,
    }: Partial<Teacher> = req.body;
    const newTeacher = await this.teacherService.createTeacher({
      matricule,
      firstname,
      lastAdvancementDate,
      lastDiploma,
      lastname,
      sex,
      hireDate,
      phone,
      email,
      institution,
      grade,
      birthdate,
      functions,
      cei,
      nextAdvancementDate,
      nextCei,
      nextGrade,
      statut,
    });
    res.status(CREATED).json({
      success: true,
      data: newTeacher,
      message: "Enseignant ajouté avec succès.",
    });
  });

  updateTeacher = catchError(async (req, res) => {
    const id = req.params.id;
    const {
      matricule,
      firstname,
      lastAdvancementDate,
      lastDiploma,
      lastname,
      sex,
      hireDate,
      phone,
      email,
      institution,
      grade,
      birthdate,
      functions,
      cei,
      nextAdvancementDate,
      nextCei,
      nextGrade,
      statut,
    }: Partial<Teacher> = req.body;
    const updateTeacher = await this.teacherService.updateTeacher(id, {
      matricule,
      firstname,
      lastAdvancementDate,
      lastDiploma,
      lastname,
      birthdate,
      functions,
      sex,
      hireDate,
      phone,
      email,
      institution,
      grade,
      cei,
      nextAdvancementDate,
      nextCei,
      nextGrade,
      statut,
    });
    res.status(OK).json({
      success: true,
      data: updateTeacher,
      message: "Enseignant modifié avec succès.",
    });
  });

  archiveTeacher = catchError(async (req, res) => {
    const id = req.params.id;
    const archived = await this.teacherService.archiveTeacher(id);
    res.status(OK).json({
      success: true,
      data: archived,
      message: "Enseignant archivé avec succès.",
    });
  });

  deleteTeacher = catchError(async (req, res) => {
    const id = req.params.id;
    await this.teacherService.deleteTeacher(id);
    res.status(OK).json({
      success: true,
      message: "Enseignant supprimé avec succès.",
    });
  });
}
