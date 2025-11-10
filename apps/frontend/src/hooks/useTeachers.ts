import { DataResponse } from "@/interfaces/response";
import { Teacher } from "@/interfaces/teacher";
import ky from "@/lib/ky";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTeachers = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<DataResponse>({
    queryKey: ["teachers"],
    queryFn: async () => await ky.get("teachers").json(),
  });

  const addTeacherMutation = useMutation({
    mutationFn: async (teacher: Teacher) =>
      await ky.post("teachers", { json: teacher }).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teachers"] }),
  });

  const updateTeacherMutation = useMutation({
    mutationFn: async (teacher: Teacher) =>
      await ky.put(`teachers/${teacher.id}`, { json: teacher }).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teachers"] }),
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: async (id: string) => await ky.delete(`teachers/${id}`).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teachers"] }),
  });

  const archiveTeacherMutation = useMutation({
    mutationFn: async (id: string) =>
      await ky.put(`teachers/archive/${id}`).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teachers"] }),
  });

  const uploadTeacherMutation = useMutation({
    mutationFn: async (teacher: FormData) =>
      await ky.put(`teachers/upload`, { body: teacher }).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teachers"] }),
  });

  return {
    Teachers: data?.data as Teacher[],
    error,
    isLoading,
    addTeacher: addTeacherMutation,
    updateTeacher: updateTeacherMutation,
    deleteTeacher: deleteTeacherMutation,
    uploadTeacherDoc: uploadTeacherMutation,
    archiveTeacher: archiveTeacherMutation,
  };
};
