import { FaArrowTrendUp } from "react-icons/fa6";

const UserAction = () => {
  return (
    <div className="p-2 rounded-md w-full flex items-center gap-8 my-4 shadow border">
      <div className="rounded-full p-2 bg-slate-200 text-blue-500">
        <FaArrowTrendUp size={30} />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Avancement</h2>
        <p className="text-xs">22/10/2025 à 22:50</p>
      </div>
    </div>
  );
};

export default UserAction;
