import { Actions } from "@/interfaces/actions";

const UserAction = ({ name, date, icon: Icon }: Actions) => {
  const actionDate = new Date(date);
  const hours = actionDate.getHours().toString().padStart(2, "0");
  const minutes = actionDate.getMinutes().toString().padStart(2, "0");

  return (
    <div className="p-3 rounded-lg w-full flex items-center gap-4 shadow-sm border bg-card hover:shadow-md transition-shadow">
      <div className="rounded-full p-2 bg-primary/10 text-primary flex-shrink-0">
        <Icon size={24} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{name}</h3>
        <p className="text-xs text-muted-foreground">
          {hours}:{minutes}
        </p>
      </div>
    </div>
  );
};

export default UserAction;
