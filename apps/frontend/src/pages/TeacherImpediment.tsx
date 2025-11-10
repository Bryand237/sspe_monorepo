import NoImpediment from "@/components/NoImpediment";
import { useImpediments } from "@/hooks/useImpediments";
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
import ImpedimentForm from "@/components/forms/ImpedimentForm";
import ImpedimentList from "@/components/ImpedimentList";
import { SubmitHandler, useForm } from "react-hook-form";
import { Impediement } from "@/interfaces/impediment";

const TeacherImpediment = () => {
  const { Impediments, addImpediment } = useImpediments();
  const impedimentForm = useForm<Impediement>();
  const onImpSubmit: SubmitHandler<Impediement> = async () => {
    const formData = new FormData();
    await addImpediment.mutateAsync(formData);
  };
  return (
    <div className="relative h-full w-full pt-12">
      <AlertDialog>
        <form onSubmit={impedimentForm.handleSubmit(onImpSubmit)}>
          {Array.isArray(Impediments) && Impediments.length !== 0 && (
            <div className="absolute top-1 left-1 h-fit p-3">
              <AlertDialogTrigger asChild>
                <button className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600">
                  Ajouter un Empechement
                </button>
              </AlertDialogTrigger>
            </div>
          )}

          {Array.isArray(Impediments) && Impediments.length === 0 ? (
            <div className="flex justify-center mt-10">
              <NoImpediment>
                <AlertDialogTrigger asChild>
                  <button className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600">
                    Ajouter un Empechement
                  </button>
                </AlertDialogTrigger>
              </NoImpediment>
            </div>
          ) : (
            <ImpedimentList impediments={Impediments} />
          )}

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold">
                Nouvel empechement
              </AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
              <ImpedimentForm {...impedimentForm} />
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
        </form>
      </AlertDialog>
    </div>
  );
};

export default TeacherImpediment;
