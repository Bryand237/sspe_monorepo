import { Doc } from "./doc";
import { Teacher } from "./teacher";

export interface Impediement {
  id?: string;
  doc?: Doc;
  teacher: Teacher;
  type: "mission" | "congé de maternié";
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
