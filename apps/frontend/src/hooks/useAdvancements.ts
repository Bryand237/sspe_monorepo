import { Advancement } from "@/interfaces/advancement";
import { DataResponse } from "@/interfaces/response";
import ky from "@/lib/ky";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAdvancements = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<DataResponse>({
    queryKey: ["advancements"],
    queryFn: async () => await ky.get("advancements").json(),
  });

  const addAdvancementMutation = useMutation({
    mutationFn: async (adv: Advancement) =>
      await ky.post("advancements", { json: adv }).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["advancements"] }),
  });

  const updateAdvancementMutation = useMutation({
    mutationFn: async (updAdv: Advancement) =>
      await ky.put(`advancements/${updAdv.id}`, { json: updAdv }).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["advancements"] }),
  });

  const deleteAdvancementMutation = useMutation({
    mutationFn: async (id: string) =>
      await ky.delete(`advancements/${id}`).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["advancements"] }),
  });

  return {
    Advancements: data?.data as Advancement[],
    error,
    isLoading,
    addAdvancement: addAdvancementMutation,
    updateAdvancement: updateAdvancementMutation,
    deleteAdvancement: deleteAdvancementMutation,
  };
};
