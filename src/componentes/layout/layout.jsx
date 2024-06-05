import React, { ReactNode, useState } from 'react';
import Navbar from './navbar'
import Sidebar from './sidebar'


function Layout({ children }) {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarIsOpen);
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <div className="border-b border-gray-300 dark:border-gray-700">
        <Navbar />
      </div>

      <div className="flex h-full">
          <div className={`border-r border-gray-300  dark:border-gray-700 content flex ${sidebarIsOpen ?  'w-64' : 'w-0'}transition-width duration-200`}>
            <Sidebar isOpen={sidebarIsOpen} onToggleSidebar={toggleSidebar}/>
          </div>
        
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export default Layout
