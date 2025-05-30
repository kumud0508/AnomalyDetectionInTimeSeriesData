import React from 'react';
import Sidebar from './Sidebar';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </>
  );
};

export default SidebarLayout;