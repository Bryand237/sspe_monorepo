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
import { FaUserShield } from "react-icons/fa6";

const NoImpediment = () => {
  return (
    <div>
      <Empty className="border-2 border-dashed w-fit mx-auto">
        <AlertDialog>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FaUserShield className="fill-blue-600" />
            </EmptyMedia>
            <EmptyTitle>Aucune empechement enregistré</EmptyTitle>
            <EmptyDescription>
              Enregistrez de nouveaux empechements.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <AlertDialogTrigger className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600">
              Ajouter un empechement
            </AlertDialogTrigger>
          </EmptyContent>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold">
                Nouvel empechement
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

export default NoImpediment;
