import { Actions, ActionsStorage } from "@/interfaces/actions";
import { getIconFromName } from "@/lib/iconMap";
import { LucideIcon } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type StoreProps = {
  actions: ActionsStorage[];
  addAction: (action: { name: string; icon: LucideIcon }) => void;
  getTodayActions: () => Actions[];
  clearActions: () => void;
};

// Fonction pour vérifier si une date est aujourd'hui
const isToday = (date: Date) => {
  const today = new Date();
  const compareDate = new Date(date);
  return (
    compareDate.getDate() === today.getDate() &&
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getFullYear() === today.getFullYear()
  );
};

// Helper to get icon name from icon component
const getIconName = (icon: LucideIcon): string => {
  return icon.displayName || icon.name || "Info";
};

export const useActionsStore = create<StoreProps>()(
  persist(
    (set, get) => ({
      actions: [],
      addAction: (action) => {
        const iconName = getIconName(action.icon);
        set((state) => ({
          actions: [
            { name: action.name, iconName, date: new Date() },
            ...state.actions,
          ],
        }));
      },
      getTodayActions: () => {
        const todayActionsStorage = get().actions.filter((action) =>
          isToday(action.date)
        );
        // Convert ActionsStorage to Actions by mapping iconName to icon component
        return todayActionsStorage.map((action) => ({
          name: action.name,
          date: action.date,
          icon: getIconFromName(action.iconName),
        }));
      },
      clearActions: () => set({ actions: [] }),
    }),
    {
      name: "actions-storage",
    }
  )
);
