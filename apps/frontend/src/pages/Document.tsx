import React, { useMemo, useState } from "react";
import DocList from "@/components/DocList";
import DocViewer from "@/components/DocViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocs } from "@/hooks/useDocs";
import { useActionsStore } from "@/stores/useActionsStore";
import { Upload, FileText, Eye, FolderOpen } from "lucide-react";
import { toast } from "sonner";

const Document = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { Docs, addDoc, isLoading } = useDocs();
  const docs = useMemo(() => Docs || [], [Docs]);
  const addAction = useActionsStore((state) => state.addAction);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (selectedFile) {
      // Vérifier si c'est un PDF
      if (selectedFile.type !== "application/pdf") {
        toast.error("Seuls les fichiers PDF sont acceptés");
        return;
      }
      // Vérifier la taille (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Le fichier ne doit pas dépasser 10 Mo");
        return;
      }
      setFile(selectedFile);
      setUploadedUrl(null);
      toast.info(`Fichier sélectionné: ${selectedFile.name}`);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.warning("Veuillez sélectionner un fichier");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await addDoc.mutateAsync(fd);
      const returned = (res as any) ?? {};
      const newDoc = returned.data ?? returned;
      setUploadedUrl(newDoc?.docPath ?? null);
      setFile(null);
      // Réinitialiser l'input file
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      toast.success("Document uploadé avec succès");
      addAction({
        name: "Document uploadé",
        icon: Upload,
      });
    } catch (err) {
      console.error("Upload error", err);
      toast.error("Erreur lors de l'upload du document");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement des documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      {/* En-tête */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-2 rounded-lg bg-primary/10">
          <FolderOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Gestion des Documents</h1>
          <p className="text-sm text-muted-foreground">
            {docs.length} document{docs.length !== 1 ? "s" : ""} enregistré{docs.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        {/* Colonne gauche: Upload et Liste */}
        <div className="flex flex-col gap-6 overflow-hidden">
          {/* Section Upload */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <CardTitle>Uploader un document</CardTitle>
              </div>
              <CardDescription>
                Sélectionnez un fichier PDF (max 10 Mo) pour l'uploader
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="file-upload"
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
                  disabled={!file || addDoc.isPending}
                  className="w-full gap-2"
                >
                  {addDoc.isPending ? (
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

          {/* Section Liste des documents */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle>Documents enregistrés</CardTitle>
              </div>
              <CardDescription>
                Cliquez sur un document pour le visualiser
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {docs.length > 0 ? (
                <DocList
                  docs={docs}
                  onOpen={(path) => {
                    setUploadedUrl(`http://localhost:5500${path}`);
                    toast.info("Document ouvert dans le viewer");
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun document</h3>
                  <p className="text-sm text-muted-foreground">
                    Uploadez votre premier document PDF pour commencer
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
              <CardTitle>Visualiseur de documents</CardTitle>
            </div>
            <CardDescription>
              Prévisualisez vos documents PDF directement dans le navigateur
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <DocViewer filePath={file ?? uploadedUrl ?? null} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Document;
