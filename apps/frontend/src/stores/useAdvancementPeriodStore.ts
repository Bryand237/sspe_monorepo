import { create } from "zustand";

type PeriodType = {
  startDate: string;
  endDate: string;
};

type AdvPeriodStoreProps = {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
};

export const useAdvancementPeriodStore = create<AdvPeriodStoreProps>((set) => ({
  period: { startDate: "", endDate: "" },
  setPeriod: (period) =>
    set({
      period: { startDate: period.startDate, endDate: period.endDate },
    }),
}));
