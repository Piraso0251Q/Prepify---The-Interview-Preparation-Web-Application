import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import "./AppLayout.css";

export const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-content page-enter" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};
