import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { INote } from "@/interfaces/INote";
import { StickyNote, AlignLeft } from "lucide-react";

const NoteForm = ({ register, formState }: UseFormReturn<INote>) => {
  return (
    <div className="space-y-4">
      <FieldSet>
        <FieldGroup className="space-y-4">
          <Field>
            <FieldLabel htmlFor="title" className="flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Titre
            </FieldLabel>
            <Input
              {...register("title", {
                required: "Le titre est obligatoire",
                minLength: {
                  value: 3,
                  message: "Le titre doit contenir au moins 3 caractères",
                },
                maxLength: {
                  value: 100,
                  message: "Le titre ne doit pas dépasser 100 caractères",
                },
              })}
              id="title"
              type="text"
              placeholder="Ex: Réunion importante, Idée de projet..."
              className={formState.errors.title ? "border-destructive" : ""}
            />
            {formState.errors.title && (
              <FieldDescription className="text-destructive">
                {formState.errors.title.message}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="content" className="flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Contenu
            </FieldLabel>
            <Textarea
              {...register("content", {
                required: "Le contenu est obligatoire",
                minLength: {
                  value: 10,
                  message: "Le contenu doit contenir au moins 10 caractères",
                },
              })}
              className={`min-h-[120px] max-h-[300px] resize-y ${
                formState.errors.content ? "border-destructive" : ""
              }`}
              id="content"
              placeholder="Écrivez le contenu de votre note ici..."
            />
            {formState.errors.content && (
              <FieldDescription className="text-destructive">
                {formState.errors.content.message}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
};

export default NoteForm;
