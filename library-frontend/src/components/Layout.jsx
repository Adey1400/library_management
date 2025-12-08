import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
        {/* 'Outlet' is where the child routes (Books, Students) will appear */}
        <Outlet />
      </div>
    </>
  );
}