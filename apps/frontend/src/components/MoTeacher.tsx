import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {} from "@/components/ui/card";

import { GiTeacher } from "react-icons/gi";
import { ReactNode } from "react";

type NoTeacherProps = {
  children: ReactNode;
};

const MoTeacher = ({ children }: NoTeacherProps) => {
  return (
    <div>
      <Empty className="border-2 border-dashed w-fit mx-auto">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <GiTeacher className="fill-blue-600" />
          </EmptyMedia>
          <EmptyTitle>Aucune ensiegnant enreistrée</EmptyTitle>
          <EmptyDescription>
            Ajoutez un nouvel enregistrement d'enseignant.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {children ?? (
            <button className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600">
              Ajouter un ensiegnant
            </button>
          )}
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default MoTeacher;
