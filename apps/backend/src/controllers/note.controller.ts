import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constants/http";
import { Note } from "../entity/note";
import { NoteService } from "../services/note.service";
import appAssert from "../utils/appAssert";
import { catchError } from "../utils/catchError";

export class NoteController {
  private noteService: NoteService;

  constructor() {
    this.noteService = new NoteService();
  }

  getAllNotes = catchError(async (req, res) => {
    const notes = await this.noteService.getAllNotes();
    res.status(OK).json({
      success: true,
      data: notes,
    });
  });

  getNoteById = catchError(async (req, res) => {
    const id = req.params.id;
    const note = await this.noteService.getNoteById(id);

    appAssert(note, NOT_FOUND, "Note non trouvée.");

    res.status(OK).json({
      success: true,
      data: note,
    });
  });

  createNote = catchError(async (req, res) => {
    const noteData: Partial<Note> = req.body;
    appAssert(noteData.title, BAD_REQUEST, "Titre obligatoire.");
    const note = await this.noteService.createNote(noteData);
    res.status(CREATED).json({
      success: true,
      data: note,
      message: "Note enregistrée avec succès.",
    });
  });

  updateNote = catchError(async (req, res) => {
    const id = req.params.id;
    const newNoteData: Partial<Note> = req.body;
    const updNote = await this.noteService.updateNote(id, newNoteData);
    appAssert(updNote, NOT_FOUND, "Note introuvable.");
    res.status(OK).json({
      success: true,
      data: updNote,
      message: "Note modifiée avec succès.",
    });
  });

  deleteNote = catchError(async (req, res) => {
    const id = req.params.id;
    const result = await this.noteService.deleteNote(id);
    appAssert(result, NOT_FOUND, "Echec de la suppression.");
    res.status(OK).json({
      success: true,
      message: "Note supprimée avec succès.",
    });
  });

  searchNote = catchError(async (req, res) => {
    const { query } = req.query;
    appAssert(
      query && typeof query === "string",
      BAD_REQUEST,
      "Le paramètre de recherche est requis."
    );
    const notes = await this.noteService.searchNote(query);
    res.status(OK).json({
      success: true,
      data: notes,
    });
  });
}
