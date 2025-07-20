// src/components/layout/MainLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen flex bg-page-background">
      {/* Sidebar with margin */}
      <div className="h-full p-3 flex-shrink-0">
        <div className="h-full rounded-lg overflow-hidden shadow-sm">
          <Sidebar collapsed={sidebarCollapsed} />
        </div>
      </div>

      {/* Content area with header */}
      <div className="flex-grow h-full flex flex-col p-3 pl-0 min-w-0">
        {/* Header with margin-bottom */}
        <div className="flex-shrink-0 mb-3 rounded-lg overflow-hidden shadow-sm">
          <Header onToggleSidebar={toggleSidebar} />
        </div>
        
        {/* Main content - Updated to fix scrollbar issue */}
        <div className="flex-grow rounded-lg overflow-hidden bg-page-background">
          <div className="h-full overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;