import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteModal from "@/components/DeleteModal";
import DocViewer from "@/components/DocViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdvancements } from "@/hooks/useAdvancements";
import { useActionsStore } from "@/stores/useActionsStore";
import { ArrowLeft, Trash, Calendar, Users, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const AdvancementInfos = () => {
  const navigate = useNavigate();
  const { id } = useParams<string>();
  const { Advancements, deleteAdvancement, isLoading } = useAdvancements();
  const addAction = useActionsStore((state) => state.addAction);

  const advancement = useMemo(
    () => Advancements?.find((adv) => adv.id === id),
    [Advancements, id]
  );

  const fmtDate = (date: Date | string | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!advancement?.id) return;
    try {
      await deleteAdvancement.mutateAsync(advancement.id);
      toast.success("Avancement supprimé");
      addAction({ name: "Avancement supprimé", icon: Trash });
      navigate("/enseignants/avancement");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!advancement) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Avancement introuvable</h2>
        <p className="text-muted-foreground">Cet avancement n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate("/enseignants/avancement")}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour aux avancements
        </Button>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      {/* En-tête */}
      <div className="flex items-center justify-between pb-4 border-b">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </Button>
        <DeleteModal
          trigger={
            <Button
              type="button"
              variant="destructive"
              className="gap-2"
            >
              <Trash className="w-4 h-4" /> Supprimer
            </Button>
          }
          title="Confirmer la suppression"
          description="Cette opération est irréversible. Voulez-vous vraiment supprimer cet avancement ?"
          submitLabel="Supprimer"
          handler={handleDelete}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden mt-6">
        {/* Colonne gauche: Informations */}
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Carte période */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <CardTitle>Période d'avancement</CardTitle>
              </div>
              <CardDescription>
                Dates de début et de fin de l'avancement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de début</p>
                  <p className="font-semibold">{fmtDate(advancement.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de fin</p>
                  <p className="font-semibold">{fmtDate(advancement.endDate)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date d'enregistrement</p>
                <p className="font-semibold">{fmtDate(advancement.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Carte enseignants */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle>Enseignants avancés</CardTitle>
              </div>
              <CardDescription>
                Liste des enseignants concernés par cet avancement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {advancement.numberOfTeachers || advancement.teachersList?.length || 0}
                  </span>
                </div>
                {advancement.teachersList && advancement.teachersList.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Liste des enseignants:</p>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {advancement.teachersList.map((teacher, idx) => (
                        <div key={teacher.id || idx} className="p-2 hover:bg-muted rounded text-sm">
                          {teacher.firstname} {teacher.lastname} - {teacher.matricule}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Carte document */}
          {advancement.doc && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle>Document associé</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{advancement.doc.docName}</p>
                    <p className="text-xs text-muted-foreground">
                      {advancement.doc.docPath}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`http://localhost:5500${advancement.doc?.docPath}`, "_blank")}
                  >
                    Ouvrir
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne droite: Viewer PDF */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle>Visualiseur PDF</CardTitle>
            </div>
            <CardDescription>
              Document officiel de l'avancement
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <DocViewer filePath={advancement.doc?.docPath || null} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancementInfos;
