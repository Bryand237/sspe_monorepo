import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
// Importation des styles de PDFSlick
// import "@pdfslick/react/dist/pdf_viewer.css";

import Layout from "./Layout";
import ErrorPage from "../pages/ErrorPage";
import Dashbord from "../pages/Dashbord";
import Notes from "../pages/Notes";
import Login from "../pages/Login";
import Advancement from "../pages/Advancement";
import TeacherList from "../pages/TeacherList";
import TeacherImpediment from "../pages/TeacherImpediment";
import InstitutionInfos from "../pages/InstitutionInfos";
import InstitutionRepresentation from "../pages/InstitutionRepresentation";
import TeacherInfos from "../pages/TeacherInfos";
import InstitutionList from "../pages/InstitutionList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Document from "@/pages/Document";
import AdvancementInfos from "@/pages/AdvancementInfos";
import ImpedimentInfos from "@/pages/ImpedimentInfos";
import AdvancementPreview from "@/pages/AdvancementPreview";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// import { pdfjs } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <Dashbord />,
        },
        {
          path: "notes",
          element: <Notes />,
        },
        {
          path: "documents",
          element: <Document />,
        },
        {
          path: "institutions",
          children: [
            {
              path: "liste",
              element: <InstitutionList />,
            },
            {
              path: "liste/:id",
              element: <InstitutionInfos />,
            },
            {
              path: "representation",
              element: <InstitutionRepresentation />,
            },
          ],
        },
        {
          path: "enseignants",
          children: [
            {
              path: "liste",
              element: <TeacherList />,
            },
            {
              path: "liste/:id",
              element: <TeacherInfos />,
            },
            {
              path: "empechement",
              element: <TeacherImpediment />,
            },
            {
              path: "empechement/:id",
              element: <ImpedimentInfos />,
            },
            {
              path: "avancement",
              element: <Advancement />,
            },
            {
              path: "avancement/:id",
              element: <AdvancementInfos />,
            },
            {
              path: "avancement/preview",
              element: <AdvancementPreview />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
