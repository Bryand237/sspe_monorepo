import { FindManyOptions, Repository } from "typeorm";
import { Note } from "../entity/note";
import { AppDataSource } from "../data/data-source";

export class NoteService {
  private noteRepository: Repository<Note>;

  constructor() {
    this.noteRepository = AppDataSource.getRepository(Note);
  }

  async getAllNotesNumber(options?: FindManyOptions): Promise<number> {
    return await this.noteRepository.count(options);
  }

  async getAllNotes(): Promise<Note[]> {
    return await this.noteRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async getNoteById(id: string): Promise<Note | null> {
    return await this.noteRepository.findOneBy({ id });
  }

  async createNote(noteData: Partial<Note>): Promise<Note> {
    const newNote = this.noteRepository.create(noteData);
    return await this.noteRepository.save(newNote);
  }

  async updateNote(id: string, noteData: Partial<Note>): Promise<Note | null> {
    await this.noteRepository.update(id, noteData);
    return await this.getNoteById(id);
  }

  async deleteNote(id: string): Promise<boolean> {
    const result = await this.noteRepository.delete(id);
    return result.affected !== 0;
  }

  async searchNote(query: string): Promise<Note[]> {
    return await this.noteRepository
      .createQueryBuilder("note")
      .where("note.title LIKE :query OR note.content LIKE :query", {
        query: `%${query}%`,
      })
      .orderBy("note.createdAt", "DESC")
      .getMany();
  }
}
