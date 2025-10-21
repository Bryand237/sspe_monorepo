export interface Note {
  id?: number;
  titre: string;
  contenu: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type NoteManipulation = Partial<Note>;
