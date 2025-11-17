import { Router } from "express";
import { TeacherController } from "../controllers/teacher.controller";
import { teacherUpload } from "../middlewares/multer.teacher";

const teacherRouter: Router = Router();
const teacherController = new TeacherController();

teacherRouter.get("/number", teacherController.getAllTeachersNumber);
teacherRouter.get("/", teacherController.getAllTeachers);
teacherRouter.get("/:id", teacherController.getTeacherById);
teacherRouter.get("/:id/docs", teacherController.getTeacherDocsFromFS);
teacherRouter.post(
  "/",
  teacherUpload.single("file"),
  teacherController.createTeacher
);
teacherRouter.post(
  "/upload",
  teacherUpload.single("file"),
  teacherController.uploadTeacherDoc
);
teacherRouter.put("/:id", teacherController.updateTeacher);
teacherRouter.put("/archive/:id", teacherController.archiveTeacher);
teacherRouter.delete("/:id", teacherController.deleteTeacher);

export default teacherRouter;
