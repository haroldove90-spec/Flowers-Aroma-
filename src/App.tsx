/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { ModuleRenderer } from './components/ModuleRenderer';
import { Toast } from './components/Toast';

const DashboardContent: React.FC = () => {
  const { activeRole } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Workspace with Desktop Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 lg:pb-8">
        {/* Desktop / Tablet Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content area offset by desktop sidebar width */}
        <main className="flex-1 lg:ml-72 p-3 sm:p-5 lg:p-6 transition-all duration-200">
          <ModuleRenderer />
        </main>
      </div>

      {/* Mobile & Tablet Quick Bottom Navigation Bar */}
      <BottomBar onOpenSidebar={() => setIsSidebarOpen(true)} />

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
