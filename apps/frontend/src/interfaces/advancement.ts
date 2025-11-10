import { Doc } from "./doc";
import { Teacher } from "./teacher";

export interface Advancement {
  id?: string;
  doc?: Doc;
  teachersList?: Teacher[];
  numberOfTeachers: number;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
