import { Teacher } from "./teacher";

export interface Institution {
  id?: string;
  fullname: string;
  abbreviation: string;
  type: "école" | "faculté";
  host: string;
  teachers?: Teacher[];
  createdAt?: Date;
  updatedAt?: Date;
}
