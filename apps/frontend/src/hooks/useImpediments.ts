import { Impediement } from "@/interfaces/impediment";
import { DataResponse } from "@/interfaces/response";
import ky from "@/lib/ky";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useImpediments = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<DataResponse>({
    queryKey: ["impediments"],
    queryFn: async () => await ky.get("impediments").json(),
  });

  const addImpedimentMutation = useMutation({
    mutationFn: async (imp: FormData) =>
      await ky.post("impediments", { body: imp }).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["impediments"] }),
  });

  // const updateImpedimentMutation = useMutation({
  //   mutationFn: async (updImp: FormData) =>
  //     await ky.put(`impediments${updImp.id}`, { body: updImp }).json(),
  //   onSuccess: () =>
  //     queryClient.invalidateQueries({ queryKey: ["impediments"] }),
  // });

  const deleteImpedimentMutation = useMutation({
    mutationFn: async (id: string) =>
      await ky.delete(`impediments/${id}`).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["impediments"] }),
  });

  return {
    Impediments: data?.data as Impediement[],
    error,
    isLoading,
    addImpediment: addImpedimentMutation,
    // updateImpediment: updateImpedimentMutation,
    deleteImpediment: deleteImpedimentMutation,
  };
};
