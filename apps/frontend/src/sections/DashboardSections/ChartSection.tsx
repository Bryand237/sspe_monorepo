import FacultyPieChart from "@/components/FacultyPieChart";
import SchoolPieChart from "@/components/SchoolPieChart";
import TeacherBarChart from "@/components/TeacherBarChart";

const ChartSection = () => {
  return (
    <div className="xl:col-span-3 p-2 overflow-y-auto h-fit xl:h-auto">
      <div className="mb-6 p-4">
        <h2>Repartition globale des enseignants</h2>
        <TeacherBarChart />
      </div>
      <div className="mb-6 p-4">
        <h2>Repartitions des enseignants par type d'institutions</h2>
        <div className=" mt-4 gap-8 flex flex-col">
          <SchoolPieChart />
          <FacultyPieChart />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
