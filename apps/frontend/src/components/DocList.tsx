import { useDocs } from "@/hooks/useDocs";
import { useActionsStore } from "@/stores/useActionsStore";
import { Doc } from "@/interfaces/doc";
import { Copy, Download, ExternalLink, FileText, Info, X } from "lucide-react";
import { toast } from "sonner";

type DocListProps = {
  docs: Doc[];
  onOpen?: (docPath: string) => void;
};

const formatBytes = (bytes?: number) => {
  if (!bytes && bytes !== 0) return "—";
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

const DocList = ({ docs, onOpen }: DocListProps) => {
  const { deleteDoc } = useDocs();
  const addAction = useActionsStore((state) => state.addAction);

  const handleCopy = async (docPath: string, docName: string) => {
    try {
      await navigator.clipboard.writeText(docPath);
      toast.success(`Lien copié: ${docName}`);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const handleDelete = async (docId: string, docName: string) => {
    try {
      await deleteDoc.mutateAsync(docId);
      toast.success(`Document supprimé: ${docName}`);
      addAction({
        name: "Document supprimé",
        icon: X,
      });
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-3">
      {docs.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow min-w-0 group"
          title={doc.docName}
        >
          <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
            <FileText className="text-primary w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate mb-1" title={doc.docName}>
              {doc.docName}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="w-3 h-3" />
              <span>{formatBytes((doc as any).docSize ?? (doc as any).docsize)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              title="Ouvrir"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (onOpen && doc.docPath) onOpen(doc.docPath);
                else if (doc.docPath)
                  window.open(doc.docPath, "_blank", "noopener,noreferrer");
              }}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
              aria-label={`Ouvrir ${doc.docName}`}
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <a
              title="Télécharger"
              href={doc.docPath ?? "#"}
              download={!!doc.docPath}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
              aria-label={`Télécharger ${doc.docName}`}
            >
              <Download className="w-4 h-4" />
            </a>

            <button
              title="Copier le lien"
              type="button"
              onClick={() => {
                if (doc.docPath) handleCopy(doc.docPath, doc.docName);
              }}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
              aria-label={`Copier le lien de ${doc.docName}`}
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              title="Supprimer le document"
              type="button"
              onClick={() => handleDelete(doc.id || "", doc.docName)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700"
              aria-label={`Supprimer le document ${doc.docName}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocList;
