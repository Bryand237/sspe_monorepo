import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useInstitutions } from "@/hooks/useInstitutions";

const chartConfig = {
  professeur: {
    label: "Professeur",
    color: "oklch(0.55 0.24 250)",
  },
  maitreConference: {
    label: "Maître de Conférence",
    color: "oklch(0.65 0.2 195)",
  },
  chargeCours: {
    label: "Chargé de cours",
    color: "oklch(0.6 0.22 285)",
  },
  assistantAvecThese: {
    label: "Assistant Avec Thèse",
    color: "oklch(0.7 0.21 45)",
  },
  assistantSansThese: {
    label: "Assistant Sans Thèse",
    color: "oklch(0.68 0.25 340)",
  },
} satisfies ChartConfig;

const TeacherBarChart = () => {
  const { Institutions, isLoading } = useInstitutions();

  const chartData = useMemo(() => {
    if (!Institutions || Institutions.length === 0) return [];

    return Institutions.map((inst) => {
      const teachers = inst.teachers || [];

      return {
        institution: inst.abbreviation,
        professeur: teachers.filter((t) => t.grade === "Professeur").length,
        maitreConference: teachers.filter(
          (t) => t.grade === "Maitre de Conférence"
        ).length,
        chargeCours: teachers.filter((t) => t.grade === "Chargé de cours")
          .length,
        assistantAvecThese: teachers.filter(
          (t) => t.grade === "Assistant Avec Thèse"
        ).length,
        assistantSansThese: teachers.filter(
          (t) => t.grade === "Assistant Sans Thèse"
        ).length,
      };
    });
  }, [Institutions]);

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="h-[450px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="institution"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <ChartLegend
            content={<ChartLegendContent />}
            verticalAlign="top"
            height={36}
          />
          <Bar
            dataKey="professeur"
            fill="oklch(0.55 0.24 250)"
            radius={[4, 4, 0, 0]}
            stackId="stack"
          />
          <Bar
            dataKey="maitreConference"
            fill="oklch(0.65 0.2 195)"
            radius={[4, 4, 0, 0]}
            stackId="stack"
          />
          <Bar
            dataKey="chargeCours"
            fill="oklch(0.6 0.22 285)"
            radius={[4, 4, 0, 0]}
            stackId="stack"
          />
          <Bar
            dataKey="assistantAvecThese"
            fill="oklch(0.7 0.21 45)"
            radius={[4, 4, 0, 0]}
            stackId="stack"
          />
          <Bar
            dataKey="assistantSansThese"
            fill="oklch(0.68 0.25 340)"
            radius={[4, 4, 0, 0]}
            stackId="stack"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default TeacherBarChart;
