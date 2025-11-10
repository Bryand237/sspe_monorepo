import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
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
import { Institution } from "@/interfaces/institution";
import { UseFormReturn, Controller } from "react-hook-form";

type InstFormProps = { methods: UseFormReturn<Institution> };

const InstitutionForm = ({ methods }: InstFormProps) => {
  const { control, register, formState } = methods;
  
  return (
    <div>
      <div className="w-full max-w-md">
        {/* <h2 className="text-2xl font-semibold mb-6">Login</h2> */}
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel className="text-lg" htmlFor="nameInstitution">
                Nom de l'institution
              </FieldLabel>
              <Input
                {...register("fullname", { required: "Le nom est requis" })}
                id="nameInstitution"
                type="text"
                placeholder="ex: Faculte des Sciences"
              />
              {formState.errors.fullname && (
                <FieldDescription className="text-destructive">
                  {formState.errors.fullname.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel className="text-lg" htmlFor="abbInstitution">
                Abbréviqtion
              </FieldLabel>
              <Input
                {...register("abbreviation", { required: "L'abréviation est requise" })}
                id="abbInstitution"
                type="text"
                placeholder="ex: FS"
              />
              {formState.errors.abbreviation && (
                <FieldDescription className="text-destructive">
                  {formState.errors.abbreviation.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel className="text-lg" htmlFor="type">
                Type
              </FieldLabel>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Le type est requis" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Types d'institution</SelectLabel>
                        <SelectItem value="école">Ecole</SelectItem>
                        <SelectItem value="faculté">Faculté</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {formState.errors.type && (
                <FieldDescription className="text-destructive">
                  {formState.errors.type.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel className="text-lg" htmlFor="owner">
                Siège
              </FieldLabel>
              <Controller
                name="host"
                control={control}
                rules={{ required: "Le siège est requis" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="owner">
                      <SelectValue placeholder="Selectionner le siège" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Siège</SelectLabel>
                        <SelectItem value="aucun">Aucun</SelectItem>
                        <SelectItem value="UN-NDERE">
                          Université de Ngaoundéré
                        </SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {formState.errors.host && (
                <FieldDescription className="text-destructive">
                  {formState.errors.host.message}
                </FieldDescription>
              )}
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
      </div>
    </div>
  );
};

export default InstitutionForm;
