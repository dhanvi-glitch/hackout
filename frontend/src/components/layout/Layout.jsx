import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSystemStatus } from '../../hooks/useSystemStatus';

export const Layout = ({ children }) => {
  const { status, refetch } = useSystemStatus();

  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header systemStatus={status} onRefreshStatus={refetch} />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
