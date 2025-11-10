import { Doc, DocResponse } from "@/interfaces/doc";
import ky from "@/lib/ky";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDocs = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<DocResponse>({
    queryKey: ["docs"],
    queryFn: async () => await ky.get("docs").json(),
  });

  const addDocMutation = useMutation({
    mutationFn: async (doc: FormData) =>
      await ky.post("docs", { body: doc }).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["docs"] }),
  });

  const deleteDocMutation = useMutation({
    mutationFn: async (id: string) => await ky.delete(`docs/${id}`).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["docs"] }),
  });

  return {
    Docs: data?.data as Doc[],
    error,
    isLoading,
    addDoc: addDocMutation,
    deleteDoc: deleteDocMutation,
  };
};
