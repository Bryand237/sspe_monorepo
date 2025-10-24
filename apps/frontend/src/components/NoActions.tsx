import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {} from "@/components/ui/card";
import { FaHand } from "react-icons/fa6";

const NoActions = () => {
  return (
    <div>
      <Empty className="border-2 border-dashed w-fit mx-auto">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FaHand className="fill-blue-600" />
          </EmptyMedia>
          <EmptyTitle>Aucune action effectuée</EmptyTitle>
          <EmptyDescription>
            Aucune operation effectue dans l'application.
          </EmptyDescription>
        </EmptyHeader>
        {/* <EmptyContent>
            <AlertDialogTrigger className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600">
              Ajouter une note
            </AlertDialogTrigger>
          </EmptyContent> */}
      </Empty>
    </div>
  );
};

export default NoActions;
