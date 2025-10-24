import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ImpedimentForm = () => {
  return (
    <div>
      <form className="w-full max-w-md">
        {/* <h2 className="text-2xl font-semibold mb-6">Login</h2> */}
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel className="text-lg" htmlFor="matricule">
                Matricule de l'enseignant
              </FieldLabel>
              <Input id="matricule" type="text" placeholder="ex: 0125-263M" />
              {/* <FieldDescription>Entrez le nom d'utilisateur.</FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel className="text-lg" htmlFor="type">
                Type
              </FieldLabel>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Types d'empechement</SelectLabel>
                    <SelectItem value="mission">mission</SelectItem>
                    <SelectItem value="conge">congé de maternité</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* <FieldDescription>Entrez le mot de passe.</FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel className="text-lg" htmlFor="startDate">
                Date de debut
              </FieldLabel>
              <Input id="startDate" type="date" />
            </Field>
            <Field>
              <FieldLabel className="text-lg" htmlFor="endDate">
                Date de fin
              </FieldLabel>
              <Input id="endDate" type="date" />
            </Field>
          </FieldGroup>
        </FieldSet>
        {/* <div className="actions flex justify-between items-center gap-8">
          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div> */}
      </form>
    </div>
  );
};

export default ImpedimentForm;
