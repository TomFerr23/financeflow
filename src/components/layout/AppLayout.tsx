'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { PageId } from '@/types';
import { Sidebar } from './Sidebar';
import {
  MobileHeader,
  HamburgerButton,
  Overlay,
  MainContent,
  Text,
} from '@/components/ui/styled';

interface AppLayoutProps {
  children: React.ReactNode;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const pageLabels: Record<PageId, string> = {
  overview: 'Overview',
  currency: 'Currency',
  stocks: 'Watchlist',
  expenses: 'Expenses',
  settings: 'Settings',
};

export function AppLayout({ children, activePage, onNavigate }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenSidebar = () => setSidebarOpen(true);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <>
      <MobileHeader>
        <HamburgerButton onClick={handleOpenSidebar} aria-label="Open menu">
          <Menu size={24} />
        </HamburgerButton>
        <Text style={{ fontSize: 18, fontWeight: 600 }}>
          {pageLabels[activePage]}
        </Text>
        <div style={{ width: 40 }} /> {/* Spacer for centering */}
      </MobileHeader>

      <Overlay $isOpen={sidebarOpen} onClick={handleCloseSidebar} />

      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      <MainContent>
        {children}
      </MainContent>
    </>
  );
}
