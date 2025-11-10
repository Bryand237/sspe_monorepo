import { LucideIcon } from "lucide-react";

// Interface for storage (serializable)
export type ActionsStorage = {
  name: string;
  date: Date;
  iconName: string;
};

// Interface for rendering (with actual icon component)
export type Actions = {
  name: string;
  date: Date;
  icon: LucideIcon;
};
