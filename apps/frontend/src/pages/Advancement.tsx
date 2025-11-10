import NoAdvancement from "@/components/NoAdvancement";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdvancements } from "@/hooks/useAdvancements";
import { useTeachers } from "@/hooks/useTeachers";
import { Advancement } from "@/interfaces/advancement";
import { useAdvancementPeriodStore } from "@/stores/useAdvancementPeriodStore";
import { ArrowRight, Calendar, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const AdvancementPage = () => {
  const { Advancements = [] as Advancement[], isLoading: loadingAdv } = useAdvancements?.() ?? {
    Advancements: [] as Advancement[],
    isLoading: false,
  };
  const { Teachers = [], isLoading: loadingTeachers } = useTeachers();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const navigate = useNavigate();
  const setPeriod = useAdvancementPeriodStore((state) => state.setPeriod);

  // Calculer le prochain avancement (6 mois après le dernier)
  const nextAdvancement = useMemo(() => {
    if (Advancements.length === 0) return null;

    // Trouver le dernier avancement
    const lastAdv = Advancements.reduce((latest, current) => {
      const latestDate = new Date(latest.endDate);
      const currentDate = new Date(current.endDate);
      return currentDate > latestDate ? current : latest;
    });

    // Calculer la date de début du prochain avancement (6 mois après la fin du dernier)
    const lastEndDate = new Date(lastAdv.endDate);
    const nextStartDate = new Date(lastEndDate);
    nextStartDate.setMonth(nextStartDate.getMonth() + 6);

    // Date de fin: 1 mois après le début
    const nextEndDate = new Date(nextStartDate);
    nextEndDate.setMonth(nextEndDate.getMonth() + 1);

    // Compter les enseignants éligibles
    const eligibleTeachers = Teachers.filter((teacher) => {
      if (teacher.statut !== "actif") return false;
      const nextAdvDate = new Date(teacher.nextAdvancementDate);
      return nextAdvDate <= nextEndDate;
    });

    return {
      startDate: nextStartDate,
      endDate: nextEndDate,
      teachersCount: eligibleTeachers.length,
    };
  }, [Advancements, Teachers]);

  const fmtDate = (d?: string | Date) => {
    if (!d) return "—";
    const date = d instanceof Date ? d : new Date(d);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("fr-FR");
  };

  const handlePreviewClick = () => {
    if (!startDate || !endDate) return;
    if (startDate >= endDate) {
      alert("La date de début doit être antérieure à la date de fin");
      return;
    }
    setPeriod({ startDate, endDate });
    navigate(`/enseignants/avancement/preview`);
  };

  const handleNextAdvancementClick = () => {
    if (!nextAdvancement) return;
    const start = nextAdvancement.startDate.toISOString().split('T')[0];
    const end = nextAdvancement.endDate.toISOString().split('T')[0];
    setPeriod({ startDate: start, endDate: end });
    navigate(`/enseignants/avancement/preview`);
  };

  if (loadingAdv || loadingTeachers) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Section de saisie de période personnalisée */}
      <div className="bg-card shadow-lg border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Définir une période d'avancement personnalisée</h2>
        </div>
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="start-date">Date de début</FieldLabel>
              <Input
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                id="start-date"
                type="date"
                className="w-full"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="end-date">Date de fin</FieldLabel>
              <Input
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                id="end-date"
                type="date"
                className="w-full"
              />
            </Field>
          </FieldGroup>
          <Button
            onClick={handlePreviewClick}
            disabled={!startDate || !endDate}
            className="mt-4 w-full md:w-auto"
          >
            Générer l'aperçu <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </FieldSet>
      </div>

      {/* Section du prochain avancement */}
      <div className="bg-card shadow-lg border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Prochain avancement suggéré</h2>
        </div>
        {nextAdvancement ? (
          <button
            type="button"
            onClick={handleNextAdvancementClick}
            className="p-6 rounded-lg w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border border-blue-200 dark:border-blue-800 transition-all"
          >
            <div className="flex flex-col gap-2 mb-4 md:mb-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Période suggérée (6 mois après le dernier avancement)</span>
              </div>
              <div className="text-base">
                Du <span className="font-semibold text-primary">{fmtDate(nextAdvancement.startDate)}</span> au{" "}
                <span className="font-semibold text-primary">{fmtDate(nextAdvancement.endDate)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border">
                <span className="text-2xl font-bold text-primary">{nextAdvancement.teachersCount}</span>
                <span className="text-sm text-muted-foreground ml-2">enseignants</span>
              </div>
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
          </button>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Aucun avancement précédent pour calculer le prochain
          </p>
        )}
      </div>

      {/* Section des anciens avancements */}
      <div className="bg-card shadow-lg border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Historique des avancements</h2>
        {Array.isArray(Advancements) && Advancements.length === 0 ? (
          <NoAdvancement />
        ) : (
          <div className="space-y-3">
            {Advancements.map((adv) => (
              <NavLink
                key={adv.id}
                to={`/enseignants/avancement/${adv.id}`}
                className="block p-5 rounded-lg bg-muted/50 hover:bg-muted border hover:border-primary/50 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Du {fmtDate(adv.startDate)} au {fmtDate(adv.endDate)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {adv.numberOfTeachers ?? 0} enseignant(s) avancé(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">Voir les détails</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancementPage;
