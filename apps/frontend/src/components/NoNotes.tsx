import { FaNoteSticky } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function NoNote() {
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
        <Button variant="outline" size="sm">
          Ajouter une note
        </Button>
      </EmptyContent>
    </Empty>
  );
}
export default NoNote;
