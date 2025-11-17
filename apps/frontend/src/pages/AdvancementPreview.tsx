import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAdvancementPeriodStore } from "@/stores/useAdvancementPeriodStore";
import { ArrowLeft, TrendingUp, X, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTeachers } from "@/hooks/useTeachers";
import { useInstitutions } from "@/hooks/useInstitutions";
import { Teacher } from "@/interfaces/teacher";
import { Institution } from "@/interfaces/institution";
import { toast } from "@/lib/toast";
import ky from "@/lib/ky";
import { generateAdvancementPdfBlob } from "@/lib/advancementPdf";

const AdvancementPreview = () => {
  const navigate = useNavigate();
  const period = useAdvancementPeriodStore((state) => state.period);
  const { Teachers, isLoading: loadingTeachers } = useTeachers();
  const { Institutions, isLoading: loadingInsts } = useInstitutions();
  const [excludedTeachers, setExcludedTeachers] = useState<Set<string>>(new Set());

  // Grades dans l'ordre spécifié
  const gradeOrder = [
    "Professeur",
    "Maitre de Conférence",
    "Chargé de cours",
    "Assistant Avec Thèse",
    "Assistant Sans Thèse",
  ];

  // Filtrer les enseignants éligibles
  const eligibleTeachers = useMemo(() => {
    if (!Teachers || !period) return [];

    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);

    return Teachers.filter((teacher) => {
      // Ne prendre que les enseignants actifs
      if (teacher.statut !== "actif") return false;
      // Vérifier si l'enseignant est exclu
      if (excludedTeachers.has(teacher.id || "")) return false;
      
      // Vérifier si la date de prochain avancement est dans la période
      const nextAdvDate = new Date(teacher.nextAdvancementDate);
      return nextAdvDate >= startDate && nextAdvDate <= endDate;
    });
  }, [Teachers, period, excludedTeachers]);

  // Grouper les enseignants par institution et par grade
  const teachersByInstitution = useMemo(() => {
    if (!Institutions || eligibleTeachers.length === 0) return [];

    return Institutions.map((inst) => {
      // Trouver les enseignants de cette institution
      const instTeachers = eligibleTeachers.filter(
        (t) => t.institution?.id === inst.id
      );

      if (instTeachers.length === 0) return null;

      // Grouper par grade
      const byGrade = gradeOrder.map((grade) => ({
        grade,
        teachers: instTeachers.filter((t) => t.grade === grade),
      })).filter((g) => g.teachers.length > 0);

      return {
        institution: inst,
        byGrade,
        total: instTeachers.length,
      };
    }).filter(Boolean) as Array<{
      institution: Institution;
      byGrade: Array<{ grade: string; teachers: Teacher[] }>;
      total: number;
    }>;
  }, [Institutions, eligibleTeachers, gradeOrder]);

  const totalTeachers = eligibleTeachers.length;

  const handleExcludeTeacher = (teacherId: string) => {
    setExcludedTeachers((prev) => {
      const newSet = new Set(prev);
      newSet.add(teacherId);
      return newSet;
    });
    toast.success("Enseignant retiré de la liste");
  };

  const handleProceed = async () => {
    const loadingToast = toast.loading(
      "Génération du PDF en cours...",
      "Veuillez patienter pendant la création du document"
    );
    
    try {
      // Collect teacher IDs for database record
      const teacherIds = eligibleTeachers.map(t => ({ id: t.id }));

      // Generate PDF client-side
      const blob = await generateAdvancementPdfBlob({
        period,
        teachersByInstitution,
        totalTeachers,
      });

      // Prepare upload
      const filename = `avancement_${Date.now()}.pdf`;
      const file = new File([blob], filename, { type: "application/pdf" });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("numberOfTeacher", String(totalTeachers));
      formData.append("startDate", String(period.startDate));
      formData.append("endDate", String(period.endDate));
      formData.append("teachersList", JSON.stringify(teacherIds));

      // Upload to backend to store and create advancement record
      await ky.post("advancements", { body: formData }).json();

      toast.dismiss(loadingToast);
      toast.success(
        "Avancement enregistré",
        "Le document PDF a été généré et stocké côté serveur"
      );
      
      // Navigate back
      setTimeout(() => navigate("/enseignants/avancement"), 1500);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        "Erreur lors de la génération du PDF",
        "Veuillez réessayer ou contacter le support"
      );
      console.error("PDF generation error:", error);
    }
  };

  const fmtDate = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("fr-FR");
  };

  if (loadingTeachers || loadingInsts) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!period) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Aucune période définie</p>
        <Button onClick={() => navigate("/enseignants/avancement")}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* En-tête fixe */}
      <div className="sticky top-0 z-10 bg-background border-b p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Retour
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Période</p>
              <p className="font-semibold">
                {fmtDate(period.startDate)} - {fmtDate(period.endDate)}
              </p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Enseignants</p>
              <p className="font-semibold text-primary text-xl">
                {totalTeachers}
              </p>
            </div>
          </div>
          <Button
            onClick={handleProceed}
            disabled={totalTeachers === 0}
            className="flex items-center gap-2"
          >
            <TrendingUp size={20} /> Procéder à l'avancement
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-8">
          {totalTeachers === 0 ? (
            <div className="bg-card border rounded-lg p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aucun enseignant éligible
              </h3>
              <p className="text-muted-foreground">
                Il n'y a aucun enseignant éligible pour un avancement dans la période sélectionnée.
              </p>
            </div>
          ) : (
            teachersByInstitution.map((data, idx) => (
              <div key={idx} className="bg-card border rounded-lg shadow-sm overflow-hidden">
                {/* En-tête de l'institution */}
                <div className="bg-primary/5 border-b p-4">
                  <h2 className="text-xl font-bold">{data.institution.fullname}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {data.institution.abbreviation} - {data.total} enseignant(s)
                  </p>
                </div>

                {/* Tableaux par grade */}
                <div className="p-4 space-y-6">
                  {data.byGrade.map((gradeData, gradeIdx) => (
                    <div key={gradeIdx}>
                      <h3 className="font-semibold mb-3 text-lg">
                        {gradeData.grade} ({gradeData.teachers.length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="border p-2 text-left w-12">N°</th>
                              <th className="border p-2 text-left">Noms et Prénoms</th>
                              <th className="border p-2 text-left">Matricule</th>
                              <th className="border p-2 text-left">Date Naissance</th>
                              <th className="border p-2 text-left">Date Prise Service</th>
                              <th className="border p-2 text-left">Dernier Diplôme</th>
                              <th className="border p-2 text-center" colSpan={2}>
                                Dernier Avancement
                              </th>
                              <th className="border p-2 text-center" colSpan={2}>
                                Nouvel Avancement
                              </th>
                              <th className="border p-2 text-left">Observation</th>
                              <th className="border p-2 text-center" colSpan={2}>
                                Signatures
                              </th>
                              <th className="border p-2 w-12"></th>
                            </tr>
                            <tr>
                              <th className="border p-2"></th>
                              <th className="border p-2"></th>
                              <th className="border p-2"></th>
                              <th className="border p-2"></th>
                              <th className="border p-2"></th>
                              <th className="border p-2"></th>
                              <th className="border p-2 text-xs">Date</th>
                              <th className="border p-2 text-xs">CEInd</th>
                              <th className="border p-2 text-xs">Date</th>
                              <th className="border p-2 text-xs">CEInd</th>
                              <th className="border p-2"></th>
                              <th className="border p-2 text-xs">AD</th>
                              <th className="border p-2 text-xs">UD</th>
                              <th className="border p-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {gradeData.teachers.map((teacher, tIdx) => (
                              <tr key={teacher.id} className="hover:bg-muted/20">
                                <td className="border p-2 text-center">{tIdx + 1}</td>
                                <td className="border p-2 font-medium">
                                  {teacher.lastname} {teacher.firstname}
                                </td>
                                <td className="border p-2">{teacher.matricule}</td>
                                <td className="border p-2">{fmtDate(teacher.birthdate)}</td>
                                <td className="border p-2">{fmtDate(teacher.hireDate)}</td>
                                <td className="border p-2">{teacher.lastDiploma}</td>
                                <td className="border p-2 text-xs">
                                  {fmtDate(teacher.lastAdvancementDate)}
                                </td>
                                <td className="border p-2 text-xs">{teacher.cei}</td>
                                <td className="border p-2 text-xs bg-green-50 dark:bg-green-950/20">
                                  {fmtDate(teacher.nextAdvancementDate)}
                                </td>
                                <td className="border p-2 text-xs bg-green-50 dark:bg-green-950/20">
                                  {teacher.nextCei}
                                </td>
                                <td className="border p-2 text-xs"></td>
                                <td className="border p-2"></td>
                                <td className="border p-2"></td>
                                <td className="border p-2 text-center">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleExcludeTeacher(teacher.id || "")}
                                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancementPreview;
