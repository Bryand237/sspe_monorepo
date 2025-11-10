import { isRouteErrorResponse, useRouteError, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const getErrorInfo = () => {
    if (isRouteErrorResponse(error)) {
      const messages: Record<number, { title: string; description: string }> = {
        404: {
          title: "Page introuvable",
          description: "La page que vous recherchez n'existe pas ou a été déplacée.",
        },
        401: {
          title: "Non autorisé",
          description: "Vous n'êtes pas autorisé à accéder à cette ressource.",
        },
        403: {
          title: "Accès interdit",
          description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        },
        500: {
          title: "Erreur serveur",
          description: "Une erreur s'est produite sur le serveur. Veuillez réessayer plus tard.",
        },
      };
      return {
        status: error.status,
        ...(messages[error.status] || {
          title: `Erreur ${error.status}`,
          description: error.statusText || "Une erreur est survenue",
        }),
        data: error.data,
      };
    }

    return {
      status: null,
      title: "Erreur inattendue",
      description: (error as Error)?.message ?? "Une erreur inconnue est survenue",
      stack: (error as Error)?.stack,
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Status */}
            {errorInfo.status && (
              <div className="mb-4">
                <span className="text-8xl font-bold text-red-600 dark:text-red-400">
                  {errorInfo.status}
                </span>
              </div>
            )}

            {/* Error Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {errorInfo.title}
            </h1>

            {/* Error Description */}
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              {errorInfo.description}
            </p>

            {/* Actions */}
            <div className="flex gap-4 flex-wrap justify-center">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retour
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Accueil
              </Button>
            </div>

            {/* Additional Error Data in Development */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 w-full">
                {errorInfo.data && (
                  <details className="text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Détails de l'erreur (dev)
                    </summary>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-xs overflow-auto">
                      {JSON.stringify(errorInfo.data, null, 2)}
                    </pre>
                  </details>
                )}
                {errorInfo.stack && (
                  <details className="text-left mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Stack trace (dev)
                    </summary>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-xs overflow-auto text-red-600 dark:text-red-400">
                      {errorInfo.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
