import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="w-screen h-screen overflow-hidden text-black bg-blue-100 grid grid-cols-[17vw_1fr]">
      <div className="p-2">
        <Sidebar />
      </div>
      <div className="p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
