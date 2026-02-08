'use client';

import { useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Target,
  ArrowRight,
  ArrowLeftRight,
  Plus,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { PageId } from '@/types';
import {
  Grid,
  Card,
  Flex,
  Text,
  Label,
  Button,
  SummaryCard,
  SummaryValue,
  SummaryLabel,
  SummaryIcon,
  theme,
} from '@/components/ui/styled';
import styled from 'styled-components';

const OverviewContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  margin-bottom: 32px;
`;

const QuickActionsCard = styled(Card)`
  margin-top: 24px;
`;

const ActivityList = styled.div`
  margin-top: 24px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div<{ $type: 'expense' | 'conversion' | 'stock' }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radii.sm};
  background: ${({ $type }) => {
    switch ($type) {
      case 'expense':
        return 'rgba(255, 59, 59, 0.1)';
      case 'conversion':
        return 'rgba(0, 102, 255, 0.1)';
      case 'stock':
        return 'rgba(0, 210, 106, 0.1)';
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'expense':
        return theme.colors.error;
      case 'conversion':
        return theme.colors.accent;
      case 'stock':
        return theme.colors.success;
    }
  }};
`;

// Utility functions defined outside component
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
  }).format(amount);
};

const formatTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

interface DashboardOverviewProps {
  onNavigate: (page: PageId) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const { user, balance } = useAppSelector((state) => state.user);
  const { expenses } = useAppSelector((state) => state.expenses);
  const { stocks, watchlist } = useAppSelector((state) => state.stocks);
  const { conversions } = useAppSelector((state) => state.currency);

  // Calculate today's spending
  const todaySpending = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return expenses
      .filter((exp) => exp.date === today)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  // Calculate this month's spending
  const monthlySpending = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenses
      .filter((exp) => new Date(exp.date) >= startOfMonth)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  // Calculate portfolio value
  const portfolioValue = useMemo(() => {
    return watchlist.reduce((total, item) => {
      const stock = stocks[item.symbol];
      return total + (stock?.price || 0);
    }, 0);
  }, [watchlist, stocks]);

  // Get recent activity (last 5 items)
  const recentActivity = useMemo(() => {
    const activities: Array<{
      id: string;
      type: 'expense' | 'conversion' | 'stock';
      description: string;
      amount: string;
      time: number;
    }> = [];

    // Add recent expenses
    expenses.slice(0, 3).forEach((exp) => {
      activities.push({
        id: `exp-${exp.id}`,
        type: 'expense',
        description: exp.description,
        amount: `-${formatCurrency(exp.amount, 'EUR')}`,
        time: new Date(exp.date).getTime(),
      });
    });

    // Add recent conversions
    conversions.slice(0, 2).forEach((conv, i) => {
      activities.push({
        id: `conv-${i}`,
        type: 'conversion',
        description: `${conv.from} to ${conv.to}`,
        amount: formatCurrency(conv.result, conv.to),
        time: conv.timestamp,
      });
    });

    return activities.sort((a, b) => b.time - a.time).slice(0, 5);
  }, [expenses, conversions]);

  return (
    <OverviewContainer>
      <WelcomeSection>
        <Text $muted style={{ marginBottom: 4 }}>{getGreeting()}</Text>
        <Text style={{ fontSize: 28, fontWeight: 700 }}>
          {user.name.split(' ')[0]}
        </Text>
      </WelcomeSection>

      <Grid $cols={2} $gap="16px">
        <SummaryCard $animate>
          <Flex $justify="space-between" $align="flex-start">
            <div>
              <SummaryLabel>Total Balance</SummaryLabel>
              <SummaryValue>
                {formatCurrency(balance.total, balance.currency)}
              </SummaryValue>
            </div>
            <SummaryIcon $color={theme.colors.accent}>
              <Wallet size={22} />
            </SummaryIcon>
          </Flex>
        </SummaryCard>

        <SummaryCard $animate>
          <Flex $justify="space-between" $align="flex-start">
            <div>
              <SummaryLabel>Portfolio Value</SummaryLabel>
              <SummaryValue>
                {formatCurrency(portfolioValue, 'USD')}
              </SummaryValue>
            </div>
            <SummaryIcon $color={theme.colors.success}>
              <TrendingUp size={22} />
            </SummaryIcon>
          </Flex>
        </SummaryCard>

        <SummaryCard $animate>
          <Flex $justify="space-between" $align="flex-start">
            <div>
              <SummaryLabel>Today's Spending</SummaryLabel>
              <SummaryValue>
                {formatCurrency(todaySpending, 'EUR')}
              </SummaryValue>
            </div>
            <SummaryIcon $color={theme.colors.error}>
              <CreditCard size={22} />
            </SummaryIcon>
          </Flex>
        </SummaryCard>

        <SummaryCard $animate>
          <Flex $justify="space-between" $align="flex-start">
            <div>
              <SummaryLabel>This Month</SummaryLabel>
              <SummaryValue>
                {formatCurrency(monthlySpending, 'EUR')}
              </SummaryValue>
            </div>
            <SummaryIcon $color={theme.colors.warning}>
              <Target size={22} />
            </SummaryIcon>
          </Flex>
        </SummaryCard>
      </Grid>

      <QuickActionsCard $animate>
        <Label style={{ display: 'block', marginBottom: 16 }}>Quick Actions</Label>
        <Flex $gap="12px" $wrap="wrap">
          <Button $variant="secondary" onClick={() => onNavigate('currency')}>
            <ArrowLeftRight size={16} />
            Convert Currency
          </Button>
          <Button $variant="secondary" onClick={() => onNavigate('expenses')}>
            <Plus size={16} />
            Add Expense
          </Button>
          <Button $variant="secondary" onClick={() => onNavigate('stocks')}>
            <TrendingUp size={16} />
            View Watchlist
          </Button>
        </Flex>
      </QuickActionsCard>

      {recentActivity.length > 0 && (
        <ActivityList>
          <Card $animate>
            <Flex $justify="space-between" $align="center" style={{ marginBottom: 16 }}>
              <Label>Recent Activity</Label>
              <Button
                $variant="ghost"
                $size="sm"
                onClick={() => onNavigate('expenses')}
                style={{ gap: 4 }}
              >
                View All <ArrowRight size={14} />
              </Button>
            </Flex>

            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id}>
                <ActivityIcon $type={activity.type}>
                  {activity.type === 'expense' && <CreditCard size={16} />}
                  {activity.type === 'conversion' && <ArrowLeftRight size={16} />}
                  {activity.type === 'stock' && <TrendingUp size={16} />}
                </ActivityIcon>
                <div style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 500 }}>{activity.description}</Text>
                  <Text $muted $size="12px">{formatTime(activity.time)}</Text>
                </div>
                <Text style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {activity.amount}
                </Text>
              </ActivityItem>
            ))}
          </Card>
        </ActivityList>
      )}
    </OverviewContainer>
  );
}
