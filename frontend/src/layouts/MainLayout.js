import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import NotificationCenter from '../components/NotificationCenter';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    return t(`pages.${path || 'dashboard'}.title`);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="lg:hidden"
      />

      {/* Static sidebar for desktop */}
      <Sidebar className="hidden lg:flex" />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          pageTitle={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationsClick={() => setNotificationsOpen(true)}
        />

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Page content */}
              <div className="glass-bg rounded-lg shadow-lg p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notification center */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
