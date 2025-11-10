import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { INote, MainNoteType } from "@/interfaces/INote";
import { Edit, Trash, Calendar } from "lucide-react";
import NoteForm from "./forms/NoteForm";
import { useNotes } from "@/hooks/useNotes";
import { useActionsStore } from "@/stores/useActionsStore";
import { toast } from "sonner";

const NoteCard = ({ id, title, content, createdAt }: MainNoteType) => {
  const editNoteForm = useForm<INote>({ defaultValues: { title, content } });
  const { updateNote, deleteNote } = useNotes();
  const [editOpen, setEditOpen] = useState(false);
  const addAction = useActionsStore((state) => state.addAction);

  const noteEditSubmit: SubmitHandler<INote> = async (data) => {
    try {
      await updateNote.mutateAsync({ ...data, id });
      editNoteForm.reset();
      setEditOpen(false);
      toast.success("Note modifiée avec succès");
      addAction({
        name: "Note modifiée",
        icon: Edit,
      });
    } catch (error) {
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote.mutateAsync(id);
      toast.success("Note supprimée");
      addAction({
        name: "Note supprimée",
        icon: Trash,
      });
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <Card className="relative h-full flex flex-col hover:shadow-lg transition-shadow group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 flex-1">{title}</CardTitle>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Bouton Éditer */}
            <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  editNoteForm.handleSubmit(noteEditSubmit)();
                }}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-semibold">
                      Modifier la note
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Modifiez le titre et le contenu de votre note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <NoteForm {...editNoteForm} />
                  </div>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          editNoteForm.reset({ title, content });
                          setEditOpen(false);
                        }}
                      >
                        Annuler
                      </Button>
                    </AlertDialogCancel>
                    <Button
                      type="submit"
                      disabled={updateNote.isPending}
                    >
                      {updateNote.isPending ? "Modification..." : "Modifier"}
                    </Button>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>

            {/* Bouton Supprimer */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pb-3">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
