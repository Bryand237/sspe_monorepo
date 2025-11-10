import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {} from "@/components/ui/card";
import { FaUserShield } from "react-icons/fa6";

type NoImpedimentProps = {
  children?: React.ReactNode;
};

const NoImpediment = ({ children }: NoImpedimentProps) => {
  return (
    <div>
      <Empty className="border-2 border-dashed w-fit mx-auto">
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
          {children ?? (
            <button className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600">
              Ajouter un Empechement
            </button>
          )}
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default NoImpediment;
