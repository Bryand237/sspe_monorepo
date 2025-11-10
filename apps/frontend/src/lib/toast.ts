import { toast as sonnerToast } from "sonner";

/**
 * Wrapper amélioré pour les toasts avec styles personnalisés
 * Utilise richColors pour les couleurs automatiques
 */

export const toast = {
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  },

  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      duration: 4500,
    });
  },

  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      duration: 3500,
    });
  },

  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      style: {
        background: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
      },
    });
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },

  // Custom styled toasts
  custom: {
    created: (itemName: string) => {
      return toast.success(`${itemName} créé avec succès`, "L'élément a été ajouté à la base de données");
    },

    updated: (itemName: string) => {
      return toast.success(`${itemName} modifié avec succès`, "Les modifications ont été enregistrées");
    },

    deleted: (itemName: string) => {
      return toast.success(`${itemName} supprimé`, "L'élément a été retiré de la base de données");
    },

    uploaded: (itemName: string) => {
      return toast.success(`${itemName} uploadé avec succès`, "Le fichier est maintenant disponible");
    },

    authSuccess: () => {
      return toast.success("Connexion réussie", "Bienvenue dans l'application");
    },

    authError: () => {
      return toast.error("Échec de connexion", "Vérifiez vos identifiants");
    },

    networkError: () => {
      return toast.error("Erreur réseau", "Impossible de contacter le serveur");
    },

    validationError: () => {
      return toast.warning("Données invalides", "Veuillez vérifier les champs du formulaire");
    },
  },
};
