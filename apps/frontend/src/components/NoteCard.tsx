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
import type { Note } from "@/interfaces/note";
import { Edit, Trash } from "lucide-react";

const NoteCard = ({ titre, contenu, createdAt }: Note) => {
  return (
    <div className="relative w-fit min-w-62">
      <Card className="max-w-72 relative">
        <CardHeader>
          <CardTitle className="text-xl">{titre}</CardTitle>
          {/* <CardAction className="absolute top-3 right-3">
            <button className="rounded-full p-2 hover:font-semibold hover:bg-green-300 hover:text-white text-green-500">
              <Edit size={18} />
            </button>
            <button className="rounded-full p-2 hover:font-semibold hover:bg-red-300 hover:text-white text-red-500">
              <Trash size={18} />
            </button>
          </CardAction> */}
        </CardHeader>
        <CardContent className="max-h-52 overflow-y-auto">
          <p>{contenu}</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs">Céé le {createdAt.toLocaleDateString()}</p>
        </CardFooter>
      </Card>
      <div className="delete-dialog">
        <AlertDialog>
          <AlertDialogTrigger className="absolute top-3 right-3 text-red-500 hover:bg-red-500 hover:text-white hover:font-semibold rounded-full p-2">
            <Trash size={18} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmation?</AlertDialogTitle>
              <AlertDialogDescription>
                Vous etes sur de vouloir supprimer cette note ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 text-red-50 hover:bg-red-600">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="update-create-dialog">
        <AlertDialog>
          <AlertDialogTrigger className="absolute top-3 right-11 text-green-500 hover:bg-green-500 hover:text-white hover:font-semibold rounded-full p-2">
            <Edit size={18} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmation?</AlertDialogTitle>
              <AlertDialogDescription>
                Vous etes sur de vouloir supprimer cette note ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction className="bg-green-500 text-green-50 hover:bg-green-600">
                Modifier
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default NoteCard;
