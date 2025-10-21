import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
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

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Layout />
          <Navigate to="/dashboard" replace={true} />
        </>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "dashboard",
          element: <Dashbord />,
        },
        {
          path: "notes",
          element: <Notes />,
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
              path: "avancement",
              element: <Advancement />,
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
  return <RouterProvider router={router} />;
};

export default App;
