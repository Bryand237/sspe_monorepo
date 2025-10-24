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

const InstitutionForm = () => {
  return (
    <div>
      <form className="w-full max-w-md">
        {/* <h2 className="text-2xl font-semibold mb-6">Login</h2> */}
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel className="text-lg" htmlFor="nameInstitution">
                Nom de l'institution
              </FieldLabel>
              <Input
                id="nameInstitution"
                type="text"
                placeholder="ex: Faculte des Sciences"
              />
              {/* <FieldDescription>Entrez le nom d'utilisateur.</FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel className="text-lg" htmlFor="abbInstitution">
                Abbréviqtion
              </FieldLabel>
              <Input id="abbInstitution" type="text" placeholder="ex: FS" />
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
                    <SelectLabel>Types d'institution</SelectLabel>
                    <SelectItem value="ecole">Ecole</SelectItem>
                    <SelectItem value="faculte">Faculté</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* <FieldDescription>Entrez le mot de passe.</FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel className="text-lg" htmlFor="owner">
                Siège
              </FieldLabel>
              <Select>
                <SelectTrigger id="owner">
                  <SelectValue placeholder="Selectionner le siège" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Siège</SelectLabel>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="unv_ng">
                      Université de Ngaoundéré
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* <FieldDescription>Entrez le mot de passe.</FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel className="text-lg" htmlFor="creationDate">
                Date de création
              </FieldLabel>
              <Input id="creationDate" type="date" />
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

export default InstitutionForm;
