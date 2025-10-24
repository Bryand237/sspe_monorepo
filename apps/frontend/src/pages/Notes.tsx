import { Empty } from "@/components/ui/empty";
import NoNote from "@/components/NoNotes";
import NoteCard from "@/components/NoteCard";
import { Plus } from "lucide-react";
import LoadingPromise from "@/components/LoadingPromise";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import NoteForm from "@/components/forms/NoteForm";

const Notes = () => {
  return (
    <div className="inline-flex items-baseline justify-baseline gap-4 ">
      <AlertDialog>
        <AlertDialogTrigger>
          {/* <Empty className="border-2 max-w-20 border-dashed w-fit mx-auto hover:border-blue-500 hover:text-blue-500">
            <Plus size={20} />
          </Empty> */}
        </AlertDialogTrigger>
        <NoNote />
        {/* <NoteCard titre="Titre" contenu="lorem50..." createdAt={new Date()} />
        <LoadingPromise /> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-semibold">
              Nouvelle note
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
            <NoteForm />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-red-500 py-2 px-3 rounded-md text-red-50 hover:bg-red-600">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction className="bg-blue-500 py-2 px-3 rounded-md text-blue-50 hover:bg-blue-600">
              Ajouter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notes;
