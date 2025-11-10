import { FaNoteSticky } from "react-icons/fa6";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type NoNoteProps = {
  children?: React.ReactNode;
};

function NoNote({ children }: NoNoteProps) {
  return (
    <Empty className="border-2 border-dashed w-fit mx-auto">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FaNoteSticky className="fill-blue-600" />
        </EmptyMedia>
        <EmptyTitle>Aucune note enreistrée</EmptyTitle>
        <EmptyDescription>Ajoutez de nouvelles notes.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {children ?? (
          <button className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600">
            Ajouter une note
          </button>
        )}
      </EmptyContent>
    </Empty>
  );
}
export default NoNote;
