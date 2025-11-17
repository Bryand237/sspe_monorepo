import DeleteModal from "@/components/DeleteModal";
import DocList from "@/components/DocList";
import DocViewer from "@/components/DocViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTeachers } from "@/hooks/useTeachers";
import { useDocs } from "@/hooks/useDocs";
import {
  Archive,
  ArrowLeft,
  Trash,
  Upload,
  FileText,
  Eye,
  UserSquare2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useActionsStore } from "@/stores/useActionsStore";
import { useQuery } from "@tanstack/react-query";
import ky from "@/lib/ky";

const TeacherInfos = () => {
  const { id } = useParams<string>();
  const {
    Teachers,
    uploadTeacherDoc,
    deleteTeacher,
    archiveTeacher,
    isLoading,
  } = useTeachers();
  const { Docs } = useDocs();
  const teacher = useMemo(
    () => Teachers?.find((t) => t.id === id),
    [Teachers, id]
  );
  const docs = useMemo(() => Docs || [], [Docs]);
  // Récupération des docs depuis le FS: /teachers/:id/docs
  const { data: fsResp, isLoading: isFsLoading } = useQuery<{
    success: boolean;
    data: any[] | undefined;
  }>({
    queryKey: ["teacher-fs-docs", id],
    enabled: Boolean(id),
    queryFn: async () => await ky.get(`teachers/${id}/docs`).json(),
  });
  const fsDocs = useMemo(() => (fsResp?.data ?? []) as any[], [fsResp]);
  const teacherDocs = useMemo(() => teacher?.docs || [], [teacher]);
  const displayedDocs = useMemo(
    () =>
      fsDocs.length > 0 ? fsDocs : teacherDocs.length > 0 ? teacherDocs : docs,
    [fsDocs, teacherDocs, docs]
  );

  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const addAction = useActionsStore((s) => s.addAction);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) {
      if (selected.type !== "application/pdf") {
        toast.error("Seuls les fichiers PDF sont acceptés");
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        toast.error("Le fichier ne doit pas dépasser 10 Mo");
        return;
      }
      setFile(selected);
      setUploadedUrl(null);
      toast.info(`Fichier sélectionné: ${selected.name}`);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !teacher) return;
    try {
      const fd = new FormData();
      // Important: pour que multer.diskStorage accède aux champs dans destination/filename,
      // il faut idéalement ajouter les champs texte AVANT le fichier dans le stream multipart.
      fd.append("teacherId", teacher.id as string);
      fd.append("matricule", teacher.matricule);
      fd.append("filename", file.name);
      fd.append("file", file);
      const resp = (await uploadTeacherDoc.mutateAsync(fd)) as {
        newDoc?: { docPath?: string };
        docPath?: string;
      };
      const url = resp?.newDoc?.docPath ?? resp?.docPath ?? null;
      setUploadedUrl(url);
      setFile(null);
      const fileInput = document.getElementById(
        "teacher-file-upload"
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      toast.success("Document uploadé avec succès");
      addAction({ name: "Document enseignant uploadé", icon: Upload });
    } catch (err) {
      console.error("Upload error", err);
      // Afficher un message d'erreur plus précis si disponible
      const anyErr = err as any;
      if (anyErr?.response) {
        try {
          const text = await anyErr.response.text();
          console.error("Server response:", text);
        } catch {}
      }
      toast.error("Erreur lors de l'upload du document");
    } finally {
    }
  };
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">
            Chargement des informations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant={"ghost"}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </Button>
          <div className="p-2 rounded-lg bg-primary/10">
            <UserSquare2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Informations de l'enseignant</h1>
            <p className="text-sm text-muted-foreground">
              {teacher?.firstname} {teacher?.lastname} • {teacher?.matricule}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DeleteModal
            trigger={
              <Button type="button" variant={"destructive"} className="gap-2">
                <Trash size={16} /> Supprimer
              </Button>
            }
            title="Confirmation"
            description="Cette operation est irreversible. Voullez-vous vraiment supprimer cet enseignant ?"
            submitLabel="Supprimer"
            handler={async () => {
              if (teacher?.id)
                await deleteTeacher.mutateAsync(teacher.id as string);
            }}
          />
          <DeleteModal
            trigger={
              <Button type="button" variant={"outline"} className="gap-2">
                <Archive size={16} /> Archiver
              </Button>
            }
            title="Confirmation"
            description="Voullez-vous vraiment archiver cet enseignant ?"
            submitLabel="Archiver"
            handler={async () => {
              if (teacher?.id)
                await archiveTeacher.mutateAsync(teacher.id as string);
            }}
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 overflow-hidden min-h-0">
        {/* Colonne gauche */}
        <div className="flex flex-col gap-6 min-h-0 overflow-y-auto pr-1">
          {/* Carte d'information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserSquare2 className="w-5 h-5 text-primary" />
                <CardTitle>Profil</CardTitle>
              </div>
              <CardDescription>Détails de l'enseignant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Matricule</div>
                  <div className="font-medium">{teacher?.matricule ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Nom</div>
                  <div className="font-medium">{teacher?.firstname ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Prénoms</div>
                  <div className="font-medium">{teacher?.lastname ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Sexe</div>
                  <div className="font-medium">{teacher?.sex ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="font-medium">{teacher?.email ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Téléphone</div>
                  <div className="font-medium">{teacher?.phone ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Dernier diplôme
                  </div>
                  <div className="font-medium">
                    {teacher?.lastDiploma ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Date de naissance
                  </div>
                  <div className="font-medium">
                    {teacher?.birthdate
                      ? new Date(teacher.birthdate).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Fonction</div>
                  <div className="font-medium">{teacher?.functions ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Grade</div>
                  <div className="font-medium">{teacher?.grade ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">CEI</div>
                  <div className="font-medium">{teacher?.cei ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Dernier avancement
                  </div>
                  <div className="font-medium">
                    {teacher?.lastAdvancementDate
                      ? new Date(
                          teacher.lastAdvancementDate
                        ).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Prochain grade
                  </div>
                  <div className="font-medium">{teacher?.nextGrade ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Prochain CEI
                  </div>
                  <div className="font-medium">{teacher?.nextCei ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Prochain avancement
                  </div>
                  <div className="font-medium">
                    {teacher?.nextAdvancementDate
                      ? new Date(
                          teacher.nextAdvancementDate
                        ).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Statut</div>
                  <div className="font-medium capitalize">
                    {teacher?.statut ?? "—"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <CardTitle>Uploader un document</CardTitle>
              </div>
              <CardDescription>Sélectionnez un PDF (max 10 Mo)</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="teacher-file-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {file && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(0)} Ko
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!file || uploadTeacherDoc.isPending || !teacher}
                  className="w-full gap-2"
                >
                  {uploadTeacherDoc.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Uploader le document
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Liste des documents (préférence aux docs de l'enseignant) */}
          <Card className="flex-1 min-h-80 flex flex-col overflow-y-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle>Documents enregistrés</CardTitle>
              </div>
              <CardDescription>
                Cliquez pour visualiser • {displayedDocs.length} document
                {displayedDocs.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {isFsLoading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  Chargement des documents...
                </div>
              ) : displayedDocs.length > 0 ? (
                <DocList
                  docs={displayedDocs}
                  onOpen={(path) => {
                    setFile(null);
                    const normalized = path?.startsWith("http")
                      ? path
                      : path?.startsWith("/")
                      ? `http://localhost:5500${path}`
                      : path;
                    setUploadedUrl(normalized ?? null);
                    toast.info("Document ouvert dans le viewer");
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun document</h3>
                  <p className="text-sm text-muted-foreground">
                    Uploadez un document PDF pour commencer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite: Viewer */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <CardTitle>Visualiseur</CardTitle>
            </div>
            <CardDescription>Prévisualisez le document choisi</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <DocViewer filePath={file ?? uploadedUrl ?? null} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherInfos;
