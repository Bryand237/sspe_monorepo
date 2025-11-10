import { CREATED, OK } from "../constants/http";
import { Teacher } from "../entity/teacher";
import { DocService } from "../services/docs.service";
import { TeacherService } from "../services/teacher.service";
import { catchError } from "../utils/catchError";

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
    const { teacherId } = req.body;
    const docName = req.file?.filename;
    const docPath = req.file?.path;
    const teacher = await this.teacherService.getTeacherById(teacherId);
    const newDoc = await this.docService.saveDoc({
      docName,
      docPath,
      teacher: teacher ?? undefined,
    });
    teacher?.docs?.push(newDoc);
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
