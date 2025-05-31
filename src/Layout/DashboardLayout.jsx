import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

const   DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-primary min-h-screen flex flex-row">
      {/* Sidebar Toggle Button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-white/75 text-secondary rounded p-2 shadow"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        {/* Hamburger icon */}
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`
          fixed top-0 left-0 z-40
          h-screen w-64
          bg-white
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex-shrink-0
          md:block
        `}
        style={{ maxWidth: "100vw" }}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end p-2">
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="text-gray-700"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
