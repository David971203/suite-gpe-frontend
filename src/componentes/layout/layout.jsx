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
    <div className=" bg-gray-50 dark:bg-gray-900">

      <div className="flex flex-col min-h-full h-screen">

        <Navbar onToggleSidebar={toggleSidebar} showToggle={true} />

        <div className="flex flex-1 overflow-y-auto border-b"> 
          
          <Sidebar isOpen={sidebarIsOpen} onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto p-4  bg-gray-100 dark:bg-gray-900 border-l  border-gray-300 dark:border-gray-700 ">
          
            {children}
          
          </main>
          
        </div>

        <FooterComp/>

      </div>

    </div>
  );
}

export default Layout;

