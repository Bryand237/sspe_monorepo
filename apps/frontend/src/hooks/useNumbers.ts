import { DataResponse } from "@/interfaces/response";
import ky from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";

export const useNumbers = () => {
  const { data: teacher } = useQuery<DataResponse>({
    queryKey: ["teachers"],
    queryFn: async () => await ky.get("teachers/number").json(),
  });

  const { data: institution } = useQuery<DataResponse>({
    queryKey: ["institutions"],
    queryFn: async () => await ky.get("institutions/number").json(),
  });

  const { data: advancement } = useQuery<DataResponse>({
    queryKey: ["advancements"],
    queryFn: async () => await ky.get("advancements/number").json(),
  });

  const { data: impediment } = useQuery<DataResponse>({
    queryKey: ["impediments"],
    queryFn: async () => await ky.get("impediments/number").json(),
  });

  return {
    teacherNumber: teacher?.number,
    institutionNumber: institution?.number,
    advancementNumber: advancement?.number,
    impedimentNumber: impediment?.number,
  };
};
