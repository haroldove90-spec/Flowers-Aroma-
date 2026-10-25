/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ModuleRenderer } from './components/ModuleRenderer';
import { Toast } from './components/Toast';

const DashboardContent: React.FC = () => {
  const { activeRole } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  });

  // If no role is active, render the clean role entry grid (2 cols mobile / 4 cols desktop)
  if (!activeRole) {
    return (
      <>
        <RoleSelector />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* Unified Institutional Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Workspace with Desktop Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-8">
        {/* Desktop / Tablet Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content area offset dynamically by sidebar state */}
        <main
          className={`flex-1 transition-all duration-200 p-3 sm:p-5 lg:p-6 w-full min-w-0 ${
            isSidebarOpen ? 'lg:ml-72' : 'ml-0'
          }`}
        >
          <ModuleRenderer />
        </main>
      </div>

      {/* Floating Notifications & Offline Indicator */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
