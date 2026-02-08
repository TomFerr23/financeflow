'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { CurrencyConverter } from './currency/CurrencyConverter';
import { StockWatchlist } from './stocks/StockWatchlist';
import { ExpenseTracker } from './expenses/ExpenseTracker';
import { Container, Title, Text, TabList, Tab, Flex, theme } from './ui/styled';

const AppWrapper = styled.div`
  min-height: 100vh;
  background: ${theme.colors.bg};
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
`;

const Header = styled.header`
  padding: 24px 0;
  border-bottom: 1px solid ${theme.colors.border};
  margin-bottom: 32px;

  @media (max-width: 768px) {
    padding: 16px 0;
    margin-bottom: 24px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${theme.colors.accent} 0%, #00D26A 100%);
  border-radius: ${theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
`;

const MainContent = styled.main`
  padding-bottom: 60px;
`;

const Footer = styled.footer`
  padding: 20px 0;
  border-top: 1px solid ${theme.colors.border};
  margin-top: 40px;
`;

const tabs = [
  { id: 'currency', label: 'Currency', icon: '💱' },
  { id: 'stocks', label: 'Watchlist', icon: '📈' },
  { id: 'expenses', label: 'Expenses', icon: '💰' },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('currency');

  return (
    <AppWrapper>
      <Container>
        <Header>
          <Flex $justify="space-between" $align="center" $wrap="wrap" $gap="16px">
            <Logo>
              <LogoIcon>FF</LogoIcon>
              <div>
                <Title style={{ fontSize: 20 }}>FinanceFlow</Title>
                <Text $muted $size="12px">Personal Finance Dashboard</Text>
              </div>
            </Logo>
            <Text $muted $size="13px">
              Built with React • TypeScript • Redux
            </Text>
          </Flex>
        </Header>

        <TabList role="tablist" aria-label="Dashboard sections">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
            >
              <span style={{ marginRight: 8 }}>{tab.icon}</span>
              {tab.label}
            </Tab>
          ))}
        </TabList>

        <MainContent>
          <div
            role="tabpanel"
            id="currency-panel"
            aria-labelledby="currency-tab"
            hidden={activeTab !== 'currency'}
          >
            {activeTab === 'currency' && <CurrencyConverter />}
          </div>

          <div
            role="tabpanel"
            id="stocks-panel"
            aria-labelledby="stocks-tab"
            hidden={activeTab !== 'stocks'}
          >
            {activeTab === 'stocks' && <StockWatchlist />}
          </div>

          <div
            role="tabpanel"
            id="expenses-panel"
            aria-labelledby="expenses-tab"
            hidden={activeTab !== 'expenses'}
          >
            {activeTab === 'expenses' && <ExpenseTracker />}
          </div>
        </MainContent>

        <Footer>
          <Flex $justify="space-between" $align="center" $wrap="wrap" $gap="12px">
            <Text $muted $size="13px">
              © 2024 Tom Ferrari • Demo Project
            </Text>
            <Flex $gap="16px">
              <Text $muted $size="13px">
                React 18 • Redux Toolkit • TypeScript • styled-components
              </Text>
            </Flex>
          </Flex>
        </Footer>
      </Container>
    </AppWrapper>
  );
}
