import { Advancement } from "./advancement";
import { Doc } from "./doc";
import { Impediement } from "./impediment";
import { Institution } from "./institution";
import { Teacher } from "./teacher";

export interface DataResponse {
  success: boolean;
  message?: string;
  number?: number;
  data?:
    | Doc
    | Institution
    | Impediement
    | Advancement
    | Teacher
    | Doc[]
    | Impediement[]
    | Institution[]
    | Advancement[]
    | Teacher[];
}
