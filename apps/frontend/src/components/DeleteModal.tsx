import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Button } from "./ui/button";

type ModalFormProps<T> = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  handler: () => void;
};

export default function DeleteModal<T>({
  trigger,
  title,
  description = "",
  submitLabel = "Valider",
  cancelLabel = "Annuler",
  handler,
}: ModalFormProps<T>) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-semibold text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel asChild>
            <Button variant={"outline"} type="button">
              {cancelLabel}
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button variant={"destructive"} type="button" onClick={handler}>
              {submitLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
