import NoActions from "@/components/NoActions";
import UserAction from "@/components/UserAction";

const ActionsRecordSection = () => {
  return (
    <div className="xl:border-l xl:p-2 px-8 overflow-y-auto">
      <h2 className="mb-4">Actions menées</h2>
      <NoActions />
      <UserAction />
    </div>
  );
};

export default ActionsRecordSection;
