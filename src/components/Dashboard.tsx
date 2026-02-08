'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { PageId } from '@/types';
import { AppLayout } from './layout/AppLayout';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { CurrencyConverter } from './currency/CurrencyConverter';
import { StockWatchlist } from './stocks/StockWatchlist';
import { ExpenseTracker } from './expenses/ExpenseTracker';
import { Settings } from './settings/Settings';
import { theme } from './ui/styled';

const AppWrapper = styled.div`
  min-height: 100vh;
  background: ${theme.colors.bg};
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
`;

const PageContainer = styled.div`
  max-width: 100%;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export function Dashboard() {
  const [activePage, setActivePage] = useState<PageId>('overview');

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <DashboardOverview onNavigate={handleNavigate} />;
      case 'currency':
        return <CurrencyConverter />;
      case 'stocks':
        return <StockWatchlist />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppWrapper>
      <AppLayout activePage={activePage} onNavigate={handleNavigate}>
        <PageContainer key={activePage}>
          {renderPage()}
        </PageContainer>
      </AppLayout>
    </AppWrapper>
  );
}
