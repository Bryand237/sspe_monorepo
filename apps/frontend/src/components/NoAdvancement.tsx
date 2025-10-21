import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import NoteForm from "./NoteForm";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { FaArrowTrendUp } from "react-icons/fa6";

const NoAdvancement = () => {
  return (
    <div>
      <Empty className="border-2 border-dashed w-fit mx-auto">
        <AlertDialog>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FaArrowTrendUp className="fill-blue-600" />
            </EmptyMedia>
            <EmptyTitle>Aucun avancement effectué</EmptyTitle>
            <EmptyDescription>
              Pas d'avancment effectué ou enregistré.
            </EmptyDescription>
          </EmptyHeader>
          {/* <EmptyContent>
            <AlertDialogTrigger className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600">
              Ajouter une note
            </AlertDialogTrigger>
          </EmptyContent> */}
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
      </Empty>
    </div>
  );
};

export default NoAdvancement;
