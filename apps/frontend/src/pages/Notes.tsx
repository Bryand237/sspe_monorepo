import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import NoNote from "@/components/NoNotes";
import NoteCard from "@/components/NoteCard";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import NoteForm from "@/components/forms/NoteForm";
import { useNotes } from "@/hooks/useNotes";
import { INote } from "@/interfaces/INote";
import { useActionsStore } from "@/stores/useActionsStore";
import { FilePlus2, StickyNote } from "lucide-react";
import { toast } from "sonner";

const Notes = () => {
  const { Notes, addNote, isLoading } = useNotes();
  const noteForm = useForm<INote>();
  const [open, setOpen] = useState(false);
  const addAction = useActionsStore((state) => state.addAction);

  const NoteSubmit: SubmitHandler<INote> = async (data) => {
    try {
      await addNote.mutateAsync(data);
      noteForm.reset();
      setOpen(false);
      toast.success("Note créée avec succès");
      addAction({
        name: "Note créée",
        icon: StickyNote,
      });
    } catch (error) {
      toast.error("Erreur lors de la création de la note");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement des notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <StickyNote className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notes</h1>
            <p className="text-sm text-muted-foreground">
              {Notes?.length || 0} note{Notes?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <AlertDialog open={open} onOpenChange={(v) => setOpen(v)}>
          <AlertDialogTrigger asChild>
            <Button className="gap-2">
              <FilePlus2 className="w-4 h-4" />
              Nouvelle note
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              noteForm.handleSubmit(NoteSubmit)();
            }}>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-semibold">
                  Créer une nouvelle note
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Ajoutez une note pour garder vos informations importantes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <NoteForm {...noteForm} />
              </div>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      noteForm.reset();
                      setOpen(false);
                    }}
                  >
                    Annuler
                  </Button>
                </AlertDialogCancel>
                <Button
                  type="submit"
                  disabled={addNote.isPending}
                >
                  {addNote.isPending ? "Création..." : "Créer"}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Grille de notes */}
      <div className="flex-1 overflow-y-auto">
        {Array.isArray(Notes) && Notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {Notes.map((note) => (
              <NoteCard key={note.id} {...note} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <NoNote>
              <AlertDialogTrigger asChild>
                <Button className="gap-2">
                  <FilePlus2 className="w-4 h-4" />
                  Créer ma première note
                </Button>
              </AlertDialogTrigger>
            </NoNote>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
