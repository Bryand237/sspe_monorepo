import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useInstitutions } from "@/hooks/useInstitutions";

const chartConfig = {
  count: {
    label: "Enseignants",
  },
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

const FacultyPieChart = () => {
  const { Institutions, isLoading } = useInstitutions();

  const chartData = React.useMemo(() => {
    if (!Institutions || Institutions.length === 0) return [];

    // Filtrer les facultés uniquement
    const faculties = Institutions.filter((inst) => inst.type === "faculté");
    const allTeachers = faculties.flatMap((inst) => inst.teachers || []);

    const gradeCount: Record<string, number> = {
      Professeur: 0,
      "Maitre de Conférence": 0,
      "Chargé de cours": 0,
      "Assistant Avec Thèse": 0,
      "Assistant Sans Thèse": 0,
    };

    allTeachers.forEach((teacher) => {
      const grade = teacher.grade as string;
      if (gradeCount[grade] !== undefined) {
        gradeCount[grade]++;
      }
    });

    return [
      {
        grade: "professeur",
        count: gradeCount.Professeur,
        fill: "oklch(0.55 0.24 250)",
      },
      {
        grade: "maitreConference",
        count: gradeCount["Maitre de Conférence"],
        fill: "oklch(0.65 0.2 195)",
      },
      {
        grade: "chargeCours",
        count: gradeCount["Chargé de cours"],
        fill: "oklch(0.6 0.22 285)",
      },
      {
        grade: "assistantAvecThese",
        count: gradeCount["Assistant Avec Thèse"],
        fill: "oklch(0.7 0.21 45)",
      },
      {
        grade: "assistantSansThese",
        count: gradeCount["Assistant Sans Thèse"],
        fill: "oklch(0.68 0.25 340)",
      },
    ].filter((item) => item.count > 0);
  }, [Institutions]);

  const totalTeachers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Facultés</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Facultés</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Facultés</CardTitle>
        <CardDescription>
          Répartition des enseignants en fonction des grades
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="grade"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTeachers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Enseignants
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default FacultyPieChart;
