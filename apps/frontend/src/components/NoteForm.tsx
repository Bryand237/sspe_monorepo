import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";

const NoteForm = () => {
  return (
    <div>
      <form className="w-full max-w-md">
        {/* <h2 className="text-2xl font-semibold mb-6">Login</h2> */}
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel className="text-lg" htmlFor="title">
                Titre
              </FieldLabel>
              <Input id="title" type="text" placeholder="Titre de la note" />
              {/* <FieldDescription>Entrez le nom d'utilisateur.</FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel className="text-lg" htmlFor="contenu">
                Contenu
              </FieldLabel>
              <Textarea
                className=" placeholder:text-white focus:ring-slate-500 max-h-[200px]"
                id="contenu"
                placeholder="Contenu"
              />
              {/* <FieldDescription>Entrez le mot de passe.</FieldDescription> */}
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

export default NoteForm;
