import { TGrade } from "./IGrade";

export interface ITeacher {
  id?: number;
  photoPath: string;
  name: string;
  surname: string;
  sex: "Male" | "Female";
  birthdate: Date;
  birthplace: string;
  lastDiploma: string;
  serviceDate: Date;
  lastAdvancementDate: Date;
  currentGrade: TGrade;
  currentCEI: string;
  nextAdvancementDate: Date;
  nextAdvancementGrade: TGrade;
  nextAdvacementCEI: string;
  createdAt: Date;
  updatedAt?: Date;
}
