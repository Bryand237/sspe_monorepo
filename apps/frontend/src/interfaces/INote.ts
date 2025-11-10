export interface INote {
  id?: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MainNoteType {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
