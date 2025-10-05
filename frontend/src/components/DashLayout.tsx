import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";

function DashLayout() {
  return (
    <div className="flex flex-col min-h-screen ">
      <DashHeader />
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50 px-6 py-4 ">
        <Outlet />
      </div>
      <DashFooter />
    </div>
  );
}

export default DashLayout;
