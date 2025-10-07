import { Outlet } from "react-router-dom";
import DashFooter from "./DashFooter";
import DashHeader from "./DashHeader";

function DashLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DashHeader />
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4">
        <Outlet />
      </main>
      <DashFooter />
    </div>
  );
}

export default DashLayout;
