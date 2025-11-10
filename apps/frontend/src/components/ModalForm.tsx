import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { SubmitHandler, UseFormReturn, FieldValues } from "react-hook-form";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type ModalFormProps<T extends FieldValues> = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  submitLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode; // inputs / fields
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function ModalForm<T extends FieldValues>({
  trigger,
  title,
  description = "",
  methods,
  onSubmit,
  submitLabel = "Valider",
  cancelLabel = "Annuler",
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ModalFormProps<T>) {
  const { handleSubmit, reset, formState } = methods;
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const internalSubmit: SubmitHandler<T> = async (values: T) => {
    try {
      await onSubmit(values);
      // only reset/close on success
      reset();
      setOpen(false);
      toast.success("Opération réussie");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
      // keep modal open so user can fix validation/server errors
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => setOpen(v)}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent
        aria-describedby={description ?? undefined}
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">
              {title}
            </AlertDialogTitle>
            {description && (
              <AlertDialogDescription className="text-sm text-muted-foreground">
                {description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          {/* zone de champs fournie par l'appelant */}
          <div className="py-4">{children}</div>

          <AlertDialogFooter className="gap-2 mt-6">
            <AlertDialogCancel asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                disabled={formState.isSubmitting}
              >
                {cancelLabel}
              </Button>
            </AlertDialogCancel>

            <Button
              type="button"
              onClick={handleSubmit(internalSubmit)}
              disabled={formState.isSubmitting}
              className="gap-2"
            >
              {formState.isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {formState.isSubmitting ? "En cours..." : submitLabel}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
