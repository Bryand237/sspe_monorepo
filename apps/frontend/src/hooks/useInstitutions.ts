import { Institution } from "@/interfaces/institution";
import { DataResponse } from "@/interfaces/response";
import ky from "@/lib/ky";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useInstitutions = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<DataResponse>({
    queryKey: ["institutions"],
    queryFn: async () => await ky.get("institutions").json(),
  });

  const addInstitutionMutation = useMutation({
    mutationFn: async (inst: Institution) =>
      await ky.post("institutions", { json: inst }).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["institutions"] }),
  });

  const updateInstitutionMutation = useMutation({
    mutationFn: async (inst: Institution) =>
      await ky.put(`institutions/${inst.id}`, { json: inst }).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["institutions"] }),
  });

  const deleteInstitutionMutation = useMutation({
    mutationFn: async (id: string) =>
      await ky.delete(`institutions/${id}`).json(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["institutions"] }),
  });

  return {
    Institutions: (data?.data as Institution[]) || ([] as Institution[]),
    error,
    isLoading,
    addInstitution: addInstitutionMutation,
    updateInstitution: updateInstitutionMutation,
    deleteInstitution: deleteInstitutionMutation,
  };
};
