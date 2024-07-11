import React, { ReactNode, useState } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import FooterComp from './footer';

function Layout({ children }) {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarIsOpen);
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} showToggle={true} />

      <div className="flex min-h-full"> 
        
        <Sidebar isOpen={sidebarIsOpen} onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 border-l border-gray-300 dark:border-gray-700">
          {children}
          
        </main>
        
      </div>
      
    </div>
  );
}

export default Layout;

