export interface INote {
  id?: number;
  titre: string;
  contenu: string;
  createdAt: Date;
  updatedAt?: Date;
}
