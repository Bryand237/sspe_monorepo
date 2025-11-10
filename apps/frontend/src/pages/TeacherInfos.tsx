import DeleteModal from "@/components/DeleteModal";
import DocList from "@/components/DocList";
import DocViewer from "@/components/DocViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTeachers } from "@/hooks/useTeachers";
import { Archive, ArrowLeft, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TeacherInfos = () => {
  const { id } = useParams<string>();
  const { Teachers, uploadTeacherDoc, deleteTeacher, archiveTeacher } =
    useTeachers();
  const teacher = useMemo(
    () => Teachers.filter((teacher) => teacher.id === id)[0],
    [Teachers]
  );

  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    // reset uploadedUrl si on choisit un nouveau fichier local
    setUploadedUrl(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("teacherId", teacher?.id as string);
      await uploadTeacherDoc.mutateAsync(fd);
      if (uploadTeacherDoc.isSuccess) {
        // attendre que le serveur renvoie le chemin/public URL du fichier
        // ex: { filename: "...", path: "/uploads/xxx.pdf" }
        const data = uploadTeacherDoc.data as {
          docPath?: string;
          docName?: string;
        };
        setUploadedUrl(data.docPath ?? null);
        // on peut aussi clear le File si on ne veut plus l'afficher localement
        // setFile(null);
      } else {
        console.error("Upload failed", uploadTeacherDoc.error);
        // gérer erreur UI si besoin
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
    }
  };
  const navigate = useNavigate();
  return (
    <div className="w-full h-full xl:grid xl:grid-cols-4 pt-12 relative">
      <div className="absolute top-1 left-1 xl:col-span-4 flex w-full items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant={"link"}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Retour
        </Button>

        <div className="flex items-center gap-4">
          <DeleteModal
            trigger={
              <Button
                type="button"
                variant={"destructive"}
                className="flex items-center gap-2"
              >
                <Trash size={20} /> Supprimer
              </Button>
            }
            title="Confirmation"
            description="Cette operation est irreversible. Voullez-vous vraiment supprimer cet enseignant ?"
            submitLabel="Supprimer"
            handler={async () => {
              await deleteTeacher.mutateAsync(teacher.id as string);
            }}
          />

          <DeleteModal
            trigger={
              <Button
                type="button"
                variant={"outline"}
                className="flex items-center gap-2"
              >
                <Archive size={20} /> Archiver
              </Button>
            }
            title="Confirmation"
            description="Voullez-vous vraiment archiver cet enseignant ?"
            submitLabel="Archiver"
            handler={async () => {
              await archiveTeacher.mutateAsync(teacher.id as string);
            }}
          />
        </div>
      </div>

      <div className="xl:col-span-4 pt-4">
        <div className="text-xl text-center font-semibold pb-4">
          Informations sur l'enseignant
        </div>
        <div className="contenu xl:flex xl:items-start gap-4">
          <div className="contenu1 w-full">
            <div className="group">
              <div className="leading-7">Matricule</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.matricule}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Noms</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.firstname}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Prénoms</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.lastname}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Sexe</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.sex}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Email</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.email}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Téléphone</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.phone}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Dernier diplome</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.lastDiploma}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Date de naissance</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.birthdate.toString()}
              </div>
            </div>
          </div>
          <div className="contenu2 w-full">
            <div className="group">
              <div className="leading-7">Fonction</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.functions}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Grades</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.grade}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Code Classe/Echelon/Indice</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.cei}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Date du dernier avancement</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.lastAdvancementDate.toString()}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Prochain grade</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.nextGrade}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">
                Prochain code Classe/Echelon/Indice
              </div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.nextCei}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Date du prochain avancement</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.nextAdvancementDate.toString()}
              </div>
            </div>
            <div className="group">
              <div className="leading-7">Statut</div>
              <div className="leading-10 text-lg font-semibold">
                {teacher.statut}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:col-span-4 pt-4">
        <div className="text-xl text-center font-semibold pb-4">
          Documents enregistrés
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="leading-7">Documents enregistrés</div>
            {teacher.docs && teacher.docs.length > 0 ? (
              <DocList docs={teacher.docs} onOpen={() => null} />
            ) : (
              <div className="p-4 bg-gray-700/20 rounded-md text-center">
                Aucun document personnel enregistré.
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="leading-7">Viewer et Uploader</div>
            <div className="flex flex-col gap-4">
              <form
                className="flex items-center p-2 justify-between"
                onSubmit={handleUpload}
              >
                <div className="flex flex-col gap-2">
                  <div>Cliquez sur "Browse" pour uploader un document PDF.</div>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
                <Button variant={"outline"} type="submit">
                  {"Upload"}
                </Button>
              </form>
              {file && <DocViewer filePath={file ?? uploadedUrl ?? null} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherInfos;
