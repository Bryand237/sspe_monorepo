import { Doc } from "./doc";
import { Teacher } from "./teacher";

export interface Advancement {
  id?: string;
  doc?: Doc;
  teachersList?: Teacher[];
  numberOfTeacher?: number; // from backend
  numberOfTeachers?: number; // legacy/client usage
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
