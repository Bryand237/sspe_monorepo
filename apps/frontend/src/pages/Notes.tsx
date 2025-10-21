import { Empty } from "@/components/ui/empty";
import NoNote from "@/components/NoNotes";
import NoteCard from "@/components/NoteCard";
import { Plus } from "lucide-react";
import LoadingPromise from "@/components/LoadingPromise";

const Notes = () => {
  return (
    <div className="inline-flex items-baseline justify-baseline gap-4 ">
      <Empty className="border-2 max-w-20 border-dashed w-fit mx-auto hover:border-blue-500 hover:text-blue-500">
        <Plus size={30} />
      </Empty>
      <NoNote />
      <NoteCard titre="Titre" contenu="lorem50..." createdAt={new Date()} />
      <LoadingPromise />
    </div>
  );
};

export default Notes;
