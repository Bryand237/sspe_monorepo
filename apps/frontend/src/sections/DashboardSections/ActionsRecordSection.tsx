import NoActions from "@/components/NoActions";
import UserAction from "@/components/UserAction";
import { useActionsStore } from "@/stores/useActionsStore";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const ActionsRecordSection = () => {
  const getTodayActions = useActionsStore((state) => state.getTodayActions);
  const clearActions = useActionsStore((state) => state.clearActions);
  const todayActions = getTodayActions();

  return (
    <div className="xl:border-l xl:p-4 px-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Actions menées aujourd'hui</h2>
        {todayActions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearActions}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      {todayActions.length > 0 ? (
        <div className="space-y-2">
          {todayActions.map((act, index) => (
            <UserAction key={index} {...act} />
          ))}
        </div>
      ) : (
        <NoActions />
      )}
    </div>
  );
};

export default ActionsRecordSection;
