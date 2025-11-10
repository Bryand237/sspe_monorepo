export interface Doc {
  id?: string;
  docName: string;
  docPath: string;
  file?: File;
  docSize: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocResponse {
  success: boolean;
  message?: string;
  data?: Doc | Doc[];
  newDoc?: Doc;
}
