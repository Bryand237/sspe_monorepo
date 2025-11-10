import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteModal from "@/components/DeleteModal";
import DocViewer from "@/components/DocViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useImpediments } from "@/hooks/useImpediments";
import { useActionsStore } from "@/stores/useActionsStore";
import { ArrowLeft, Trash, Calendar, User, FileText, AlertCircle, Ban } from "lucide-react";
import { toast } from "sonner";

const ImpedimentInfos = () => {
  const navigate = useNavigate();
  const { id } = useParams<string>();
  const { Impediments, deleteImpediment, isLoading } = useImpediments();
  const addAction = useActionsStore((state) => state.addAction);

  const impediment = useMemo(
    () => Impediments?.find((imp) => imp.id === id),
    [Impediments, id]
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
    if (!impediment?.id) return;
    try {
      await deleteImpediment.mutateAsync(impediment.id);
      toast.success("Empêchement supprimé");
      addAction({ name: "Empêchement supprimé", icon: Trash });
      navigate("/enseignants/empechement");
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

  if (!impediment) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Empêchement introuvable</h2>
        <p className="text-muted-foreground">Cet empêchement n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate("/enseignants/empechement")}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour aux empêchements
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
          description="Cette opération est irréversible. Voulez-vous vraiment supprimer cet empêchement ?"
          submitLabel="Supprimer"
          handler={handleDelete}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden mt-6">
        {/* Colonne gauche: Informations */}
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Carte type d'empêchement */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-primary" />
                <CardTitle>Type d'empêchement</CardTitle>
              </div>
              <CardDescription>
                Catégorie de l'empêchement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-lg">{impediment.type || "—"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Carte période */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <CardTitle>Période</CardTitle>
              </div>
              <CardDescription>
                Durée de l'empêchement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de début</p>
                  <p className="font-semibold">{fmtDate(impediment.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de fin</p>
                  <p className="font-semibold">{fmtDate(impediment.endDate)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date d'enregistrement</p>
                <p className="font-semibold">{fmtDate(impediment.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Carte enseignant */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Enseignant concerné</CardTitle>
              </div>
              <CardDescription>
                Informations sur l'enseignant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nom complet</p>
                <p className="font-semibold">
                  {impediment.teacher?.firstname} {impediment.teacher?.lastname}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Matricule</p>
                <p className="font-semibold">{impediment.teacher?.matricule || "—"}</p>
              </div>
              {impediment.teacher?.grade && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Grade</p>
                  <p className="font-semibold">{impediment.teacher.grade}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Carte document */}
          {impediment.doc && (
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
                    <p className="font-medium">{impediment.doc.docName}</p>
                    <p className="text-xs text-muted-foreground">
                      {impediment.doc.docPath}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`http://localhost:5500${impediment.doc?.docPath}`, "_blank")}
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
              Document justificatif de l'empêchement
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <DocViewer filePath={impediment.doc?.docPath || null} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImpedimentInfos;
