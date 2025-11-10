import {
  Building2,
  UserPlus,
  FileText,
  Trash2,
  Edit,
  Plus,
  Check,
  X,
  AlertCircle,
  Info,
  LucideIcon,
} from "lucide-react";

// Map of icon names to icon components
export const iconMap: Record<string, LucideIcon> = {
  Building2,
  UserPlus,
  FileText,
  Trash2,
  Edit,
  Plus,
  Check,
  X,
  AlertCircle,
  Info,
};

// Get icon component from name, with fallback
export const getIconFromName = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Info;
};
