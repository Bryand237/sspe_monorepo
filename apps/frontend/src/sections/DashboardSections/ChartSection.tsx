import FacultyPieChart from "@/components/FacultyPieChart";
import NoteCard from "@/components/NoteCard";
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
      <div className="mb-4 p-4">
        <h2>Notes enregistrées</h2>
        <div className="w-full flex gap-4 mt-4 overflow-x-auto">
          <NoteCard
            titre="Titre"
            contenu="CContenu text..."
            createdAt={new Date()}
          />
          <NoteCard
            titre="Titre"
            contenu="CContenu text..."
            createdAt={new Date()}
          />
          <NoteCard
            titre="Titre"
            contenu="CContenu text..."
            createdAt={new Date()}
          />
          <NoteCard
            titre="Titre"
            contenu="CContenu text..."
            createdAt={new Date()}
          />
          <NoteCard
            titre="Titre"
            contenu="CContenu text..."
            createdAt={new Date()}
          />
          <NoteCard
            titre="Titre"
            contenu="CContenu text..."
            createdAt={new Date()}
          />
          <NoteCard
            titre="Titre"
            contenu="CContenu text..."
            createdAt={new Date()}
          />
          <NoteCard
            titre="Titre"
            contenu="CContenu text..."
            createdAt={new Date()}
          />
          <NoteCard
            titre="Titre"
            contenu="CContenu text..."
            createdAt={new Date()}
          />
          <NoteCard
            titre="Titre"
            contenu="CContenu text..."
            createdAt={new Date()}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
