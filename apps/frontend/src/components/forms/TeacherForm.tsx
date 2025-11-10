import { Teacher } from "@/interfaces/teacher";
import { UseFormReturn, Controller } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useInstitutions } from "@/hooks/useInstitutions";
import { useMemo } from "react";

const TeacherForm = ({
  register,
  formState,
  watch,
  control,
}: UseFormReturn<Teacher>) => {
  const { Institutions } = useInstitutions();
  const grades = [
    "Professeur",
    "Maitre de Conférence",
    "Chargé de cours",
    "Assistant Sans Thèse",
    "Assistant Avec Thèse",
  ];

  const grade = watch("grade");
  const nextGrade = watch("nextGrade");

  const getCeisByGrade = (gradeValue: string | undefined): string[] => {
    switch (gradeValue) {
      case "Assistant Avec Thèse":
        return ["3C/3E/606", "3C/2E/665", "3C/1E/715"];
      case "Assistant Sans Thèse":
        return ["3C/3E/320", "3C/2E/450", "3C/1E/540"];
      case "Chargé de cours":
        return [
          "2C/1E/715",
          "2C/2E/785",
          "2C/3E/870",
          "2C/4E/940",
          "2C/5E/1005",
          "2C/6E/1050",
          "1C/1E/1115",
          "1C/2E/1140",
          "1C/3E/1200",
          "CE/1240",
        ];
      case "Maitre de Conférence":
        return [
          "2C/1E/785",
          "2C/2E/870",
          "2C/3E/940",
          "2C/4E/1005",
          "2C/5E/1050",
          "2C/6E/1115",
          "1C/1E/1140",
          "1C/2E/1200",
          "1C/3E/1240",
          "CE/1300",
        ];
      case "Professeur":
        return [
          "2C/1E/940",
          "2C/2E/1005",
          "2C/3E/1050",
          "2C/4E/1115",
          "2C/5E/1140",
          "1C/1E/1200",
          "1C/3E/1240",
          "1C/3E/1300",
          "CE/1350",
          "HE/1400",
        ];
      default:
        return [];
    }
  };

  const getNextGradesByGrade = (gradeValue: string | undefined): string[] => {
    switch (gradeValue) {
      case "Assistant Sans Thèse":
        return ["Assistant Sans Thèse", "Assistant Avec Thèse"];
      case "Assistant Avec Thèse":
        return ["Chargé de cours", "Assistant Avec Thèse"];
      case "Chargé de cours":
        return ["Chargé de cours", "Maitre de Conférence"];
      case "Maitre de Conférence":
        return ["Professeur", "Maitre de Conférence"];
      case "Professeur":
        return ["Professeur"];
      default:
        return [];
    }
  };

  const ceis = useMemo(() => getCeisByGrade(grade), [grade]);
  const nextCeis = useMemo(() => getCeisByGrade(nextGrade), [nextGrade]);
  const nextGrades = useMemo(() => getNextGradesByGrade(grade), [grade]);

  return (
    <div className="max-h-[70vh] overflow-y-auto py-4 my-4">
      <FieldSet className="grid grid-cols-2 gap-2">
        <FieldGroup className="col-span-1">
          <Field>
            <FieldLabel className="text-lg" htmlFor="matricule">
              Matricule
            </FieldLabel>
            <Input
              {...register("matricule", { required: true })}
              id="matricule"
              type="text"
            />
            {formState.errors.matricule && (
              <FieldDescription>
                {formState.errors.matricule.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="firstname">
              Noms
            </FieldLabel>
            <Input
              {...register("firstname", { required: true })}
              id="firstname"
              type="text"
            />
            {formState.errors.firstname && (
              <FieldDescription>
                {formState.errors.firstname.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="lastname">
              Prénoms
            </FieldLabel>
            <Input
              {...register("lastname", { required: true })}
              id="lastname"
              type="text"
            />
            {formState.errors.lastname && (
              <FieldDescription>
                {formState.errors.lastname.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="lastDiploma">
              Dernier diplome
            </FieldLabel>
            <Input
              {...register("lastDiploma", { required: true })}
              id="lastDiploma"
              type="text"
            />
            {formState.errors.lastDiploma && (
              <FieldDescription>
                {formState.errors.lastDiploma.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="sex">
              Sexe
            </FieldLabel>
            <Controller
              name="sex"
              control={control}
              rules={{ required: "Le sexe est requis" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Selectionner un sexe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sexes</SelectLabel>
                      <SelectItem value="Masculin">Masculin</SelectItem>
                      <SelectItem value="Feminin">Feminin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.sex && (
              <FieldDescription className="text-destructive">
                {formState.errors.sex.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="hireDate">
              Date de prise de service
            </FieldLabel>
            <Input
              {...register("hireDate", { required: true })}
              id="hireDate"
              type="date"
            />
            {formState.errors.hireDate && (
              <FieldDescription>
                {formState.errors.hireDate.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="email">
              Email
            </FieldLabel>
            <Input
              {...register("email", { required: true })}
              id="email"
              type="text"
            />
            {formState.errors.email && (
              <FieldDescription>
                {formState.errors.email.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="phone">
              Téléphone
            </FieldLabel>
            <Input
              {...register("phone", { required: true })}
              id="phone"
              type="text"
            />
            {formState.errors.phone && (
              <FieldDescription>
                {formState.errors.phone.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="function">
              Date de naissance
            </FieldLabel>
            <Input
              {...register("birthdate", { required: true })}
              id="birthdate"
              type="date"
            />
            {formState.errors.birthdate && (
              <FieldDescription>
                {formState.errors.birthdate.message}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
        <FieldGroup className="col-span-1">
          <Field>
            <FieldLabel className="text-lg" htmlFor="function">
              Fonction
            </FieldLabel>
            <Input
              {...register("functions", { required: true })}
              id="function"
              type="text"
            />
            {formState.errors.functions && (
              <FieldDescription>
                {formState.errors.functions.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="institution">
              Institutions
            </FieldLabel>
            <Controller
              name="institution"
              control={control}
              rules={{ required: "L'institution est requise" }}
              render={({ field }) => (
                <Select 
                  onValueChange={(value) => {
                    const selectedInst = Institutions?.find(i => i.id === value);
                    field.onChange(selectedInst);
                  }} 
                  value={typeof field.value === 'object' ? field.value?.id : field.value}
                >
                  <SelectTrigger id="institution">
                    <SelectValue placeholder="Selectionnez une institution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Institution</SelectLabel>
                      {Array.isArray(Institutions) &&
                        Institutions.map((inst) => (
                          <SelectItem key={inst.id} value={inst?.id as string}>
                            {inst.abbreviation}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.institution && (
              <FieldDescription className="text-destructive">
                {formState.errors.institution.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="grade">
              Grade
            </FieldLabel>
            <Controller
              name="grade"
              control={control}
              rules={{ required: "Le grade est requis" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Selectionnez le grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Grades</SelectLabel>
                      {grades.map((gradeItem) => (
                        <SelectItem key={gradeItem} value={gradeItem}>
                          {gradeItem}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.grade && (
              <FieldDescription className="text-destructive">
                {formState.errors.grade.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="nextGrade">
              Grade Prochain
            </FieldLabel>
            <Controller
              name="nextGrade"
              control={control}
              rules={{ required: "Le prochain grade est requis" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="nextGrade">
                    <SelectValue placeholder="Selectionnez le prochain grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Grades</SelectLabel>
                      {nextGrades.map((gradeItem) => (
                        <SelectItem key={gradeItem} value={gradeItem}>
                          {gradeItem}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.nextGrade && (
              <FieldDescription className="text-destructive">
                {formState.errors.nextGrade.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="cei">
              CEI
            </FieldLabel>
            <Controller
              name="cei"
              control={control}
              rules={{ required: "Le CEI est requis" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="cei">
                    <SelectValue placeholder="Selectionnez le code Classe/Echelon/Indice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Classe/Echelon/Indice</SelectLabel>
                      {ceis.map((ceiItem) => (
                        <SelectItem key={ceiItem} value={ceiItem}>
                          {ceiItem}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.cei && (
              <FieldDescription className="text-destructive">
                {formState.errors.cei.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="nextCei">
              CEI Prochain
            </FieldLabel>
            <Controller
              name="nextCei"
              control={control}
              rules={{ required: "Le prochain CEI est requis" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="nextCei">
                    <SelectValue placeholder="Selectionnez le prochain code Classe/Echelon/Indice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Classe/Echelon/Indice</SelectLabel>
                      {nextCeis.map((ceiItem) => (
                        <SelectItem key={ceiItem} value={ceiItem}>
                          {ceiItem}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.nextCei && (
              <FieldDescription className="text-destructive">
                {formState.errors.nextCei.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="lastAdvancementDate">
              Date du dernier avancement
            </FieldLabel>
            <Input
              {...register("lastAdvancementDate", { required: true })}
              id="lastAdvancementDate"
              type="date"
            />
            {formState.errors.lastAdvancementDate && (
              <FieldDescription>
                {formState.errors.lastAdvancementDate.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="nextAdvancementDate">
              Date du prochain avancement
            </FieldLabel>
            <Input
              {...register("nextAdvancementDate", { required: true })}
              id="nextAdvancementDate"
              type="date"
            />
            {formState.errors.nextAdvancementDate && (
              <FieldDescription>
                {formState.errors.nextAdvancementDate.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-lg" htmlFor="statut">
              Statut
            </FieldLabel>
            <Controller
              name="statut"
              control={control}
              rules={{ required: "Le statut est requis" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="statut">
                    <SelectValue placeholder="Selectionnez le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Statuts</SelectLabel>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="archivé">Archivé</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.statut && (
              <FieldDescription className="text-destructive">
                {formState.errors.statut.message}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
};

export default TeacherForm;
