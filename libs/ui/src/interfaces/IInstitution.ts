export interface IInstitution {
  id?: number;
  logoPath: string;
  name: string;
  abbreviation: string;
  type: string;
  siege: string;
  createdAt: Date;
  updatedAt?: Date;
}
