import React, { ReactNode, useState } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';

function Layout({ children }) {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarIsOpen);
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} showToggle={true} />

      <div className="flex h-full">
        <Sidebar isOpen={sidebarIsOpen} onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;

