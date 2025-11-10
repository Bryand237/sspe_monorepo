// Core viewer
import { Viewer, Worker } from "@react-pdf-viewer/core";

// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useEffect, useState } from "react";

type DocViewerProps = {
  filePath: string | File | null;
};

const DocViewer = ({ filePath }: DocViewerProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [fileUrl, setFileUrl] = useState<string | undefined>();

  useEffect(() => {
    // si File, créer object URL et le révoquer au cleanup
    if (filePath instanceof File) {
      const url = URL.createObjectURL(filePath);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    // si string, l'utiliser comme URL publique
    if (typeof filePath === "string") {
      setFileUrl(filePath);
      return;
    }

    setFileUrl(undefined);
  }, [filePath]);

  const pdfjsVersion = "3.4.120";

  return (
    <div className="h-[calc(100dvh-(80px+200px))] w-full p-2 border border-muted rounded-md">
      {/* PDF Viewer implementation goes here */}
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
      >
        {fileUrl ? (
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted">
            Aucun document sélectionné
          </div>
        )}
      </Worker>
    </div>
  );
};

export default DocViewer;
