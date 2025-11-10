import { INote, MainNoteType } from "@/interfaces/INote";
import ky from "@/lib/ky";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ReturnType = {
  success: boolean;
  data?: MainNoteType | MainNoteType[];
  message?: string;
};

export const useNotes = () => {
  const queryClient = useQueryClient();

  const {
    data: Notes,
    isLoading,
    error,
  } = useQuery<ReturnType>({
    queryKey: ["notes"],
    queryFn: async () => ky.get("notes").json(),
  });

  const addNote = useMutation({
    mutationFn: async (note: INote) =>
      ky
        .post("notes", {
          json: note,
        })
        .json(),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const updateNote = useMutation({
    mutationFn: async (updatesNote: INote) =>
      ky
        .put(`notes/${updatesNote.id}`, {
          json: updatesNote,
        })
        .json(),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => ky.delete(`notes/${id}`).json(),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  return {
    Notes: Notes?.data || ([] as MainNoteType[]),
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
  };
};
