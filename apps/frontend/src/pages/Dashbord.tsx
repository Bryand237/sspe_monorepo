import ActionsRecordSection from "@/sections/DashboardSections/ActionsRecordSection";
import ChartSection from "@/sections/DashboardSections/ChartSection";

const Dashbord = () => {
  return (
    <div className="w-full h-full xl:grid xl:grid-cols-4">
      <ChartSection />
      <ActionsRecordSection />
    </div>
  );
};

export default Dashbord;
