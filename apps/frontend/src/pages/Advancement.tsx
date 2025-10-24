import NoAdvancement from "@/components/NoAdvancement";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const Advancement = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="date-inputs shadow-md border p-6 rounded-md w-[40rem]">
        <FieldSet>
          <FieldGroup className="grid grid-cols-2 items-center justify-evenly">
            <Field>
              <FieldLabel htmlFor="start-date">Date initiale</FieldLabel>
              <Input id="start-date" type="date" />
              {/* <FieldDescription>Entrez le nom d'utilisateur.</FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel htmlFor="end-date">Date finale</FieldLabel>
              <Input id="end-date" type="date" placeholder="********" />
              {/* <FieldDescription>Entrez le mot de passe.</FieldDescription> */}
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
      <div className="next-adv w-full">
        <h2>Prochain avancement</h2>
        <button className="p-4 rounded-md shadow-md w-full flex items-center justify-between bg-slate-100 hover:bg-slate-200">
          <div className="dates">
            du <span className="font-semibold">02/01/2026</span> au{" "}
            <span className="font-semibold">06/062026</span>
          </div>
          <div className="nombre-enseignants">207 enseignants</div>
          <div className="details flex items-center gap-2">
            Details <ArrowRight />
          </div>
        </button>
      </div>
      <div className="old-adv w-full">
        <h2>Anciens avancements</h2>
        <NoAdvancement />
      </div>
    </div>
  );
};

export default Advancement;
