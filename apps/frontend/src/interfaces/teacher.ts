import { Advancement } from "./advancement";
import { Doc } from "./doc";
import { Impediement } from "./impediment";
import { Institution } from "./institution";

export interface Teacher {
  id?: string;
  matricule: string;
  firstname: string;
  lastname: string;
  lastDiploma: string;
  sex: "Masculin" | "Feminin";
  hireDate: Date;
  email: string;
  phone: string;
  functions: string;
  birthdate: Date;
  institution: Institution;
  docs?: Doc[];
  impediments?: Impediement[];
  advancements?: Advancement[];
  grade:
    | "Professeur"
    | "Maitre de Conférence"
    | "Chargé de cours"
    | "Assistant Sans Thèse"
    | "Assistant Avec Thèse";
  nextGrade:
    | "Professeur"
    | "Maitre de Conférence"
    | "Chargé de cours"
    | "Assistant Sans Thèse"
    | "Assistant Avec Thèse";
  cei: string;
  nextCei: string;
  lastAdvancementDate: Date;
  nextAdvancementDate: Date;
  statut: "actif" | "archivé";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UploadTeacherDoc {
  teacherId: string;
  doc: File;
}
