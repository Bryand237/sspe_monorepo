import { Impediement } from "@/interfaces/impediment";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

type ImpedimentListProps = {
  impediments: Impediement[];
};

const ImpedimentList = ({ impediments }: ImpedimentListProps) => {
  return (
    <div className="w-full h-full flex flex-col gap-3">
      {Array.isArray(impediments) && (
        <div>
          {impediments.map((imp) => (
            <NavLink
              to={`/empechements/${imp.id}`}
              key={imp.id}
              className="p-4 rounded-md shadow-md w-full flex items-center justify-between bg-slate-100 hover:bg-slate-200"
            >
              <div className="dates">
                du{" "}
                <span className="font-semibold">
                  {imp.startDate.toLocaleDateString()}
                </span>{" "}
                au{" "}
                <span className="font-semibold">
                  {imp.endDate.toLocaleDateString()}
                </span>
              </div>
              <div className="nombre-enseignants">{imp.teacher.matricule}</div>
              <div className="details flex items-center gap-2">
                Details <ArrowRight />
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImpedimentList;
