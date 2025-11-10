import { Router } from "express";
import { NoteController } from "../controllers/note.controller";

const noteRouter: Router = Router();
const noteController = new NoteController();

noteRouter.get("/", noteController.getAllNotes);
noteRouter.get("/:id", noteController.getNoteById);
noteRouter.get("/search", noteController.searchNote);
noteRouter.post("/", noteController.createNote);
noteRouter.put("/:id", noteController.updateNote);
noteRouter.delete("/:id", noteController.deleteNote);

export default noteRouter;
