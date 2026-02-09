'use client';

import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
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
import { PageId, ExpenseCategory } from '@/types';
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
  ChartCard,
  ChartHeader,
  ChartContainer,
  ChartTooltip,
  FilterTabList,
  FilterTab,
  theme,
} from '@/components/ui/styled';
import styled from 'styled-components';

const OverviewContainer = styled.div`
  max-width: 1000px;
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
  border-radius: 8px;
  background: ${({ $type }) => {
    switch ($type) {
      case 'expense':
        return theme.colors.errorLight;
      case 'conversion':
        return theme.colors.accentLight;
      case 'stock':
        return theme.colors.successLight;
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

const ChartsSection = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
`;

const CategoryLabel = styled.div`
  width: 100px;
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`;

const CategoryProgress = styled.div`
  flex: 1;
  height: 8px;
  background: ${theme.colors.bgTertiary};
  border-radius: 4px;
  overflow: hidden;
`;

const CategoryFill = styled.div<{ $width: number; $color: string; $delay: number }>`
  height: 100%;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  width: 0;
  animation: growWidth 0.8s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;

  @keyframes growWidth {
    to {
      width: ${({ $width }) => $width}%;
    }
  }
`;

const CategoryAmount = styled.div`
  width: 80px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

type TimeFilter = '7d' | '30d' | '90d' | 'all';

// Utility functions
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

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#FF6B6B',
  transport: '#4ECDC4',
  entertainment: '#FFE66D',
  shopping: '#95E1D3',
  bills: '#DDA0DD',
  health: '#98D8C8',
  other: '#F7DC6F',
};

interface DashboardOverviewProps {
  onNavigate: (page: PageId) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const { user, balance } = useAppSelector((state) => state.user);
  const { expenses } = useAppSelector((state) => state.expenses);
  const { stocks, watchlist } = useAppSelector((state) => state.stocks);
  const { conversions } = useAppSelector((state) => state.currency);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');

  // Filter expenses by time
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return expenses;
    }

    return expenses.filter((exp) => new Date(exp.date) >= startDate);
  }, [expenses, timeFilter]);

  // Calculate spending over time for chart
  const spendingOverTime = useMemo(() => {
    const grouped: Record<string, number> = {};

    filteredExpenses.forEach((exp) => {
      const dateKey = exp.date;
      grouped[dateKey] = (grouped[dateKey] || 0) + exp.amount;
    });

    return Object.entries(grouped)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount,
        fullDate: date,
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
      .slice(-14); // Last 14 data points
  }, [filteredExpenses]);

  // Calculate spending by category
  const spendingByCategory = useMemo(() => {
    const byCategory: Partial<Record<ExpenseCategory, number>> = {};

    filteredExpenses.forEach((exp) => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });

    const total = Object.values(byCategory).reduce((sum, val) => sum + val, 0);

    return Object.entries(byCategory)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses]);

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

  // Get recent activity
  const recentActivity = useMemo(() => {
    const activities: Array<{
      id: string;
      type: 'expense' | 'conversion' | 'stock';
      description: string;
      amount: string;
      time: number;
    }> = [];

    expenses.slice(0, 3).forEach((exp) => {
      activities.push({
        id: `exp-${exp.id}`,
        type: 'expense',
        description: exp.description,
        amount: `-${formatCurrency(exp.amount, 'EUR')}`,
        time: new Date(exp.date).getTime(),
      });
    });

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

  const totalFilteredSpending = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <ChartTooltip>
          <Text $size="12px" $muted>{label}</Text>
          <Text style={{ fontWeight: 600, marginTop: 4 }}>
            {formatCurrency(payload[0].value, 'EUR')}
          </Text>
        </ChartTooltip>
      );
    }
    return null;
  };

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
            <SummaryIcon $color="#0066FF">
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
            <SummaryIcon $color="#00D26A">
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
            <SummaryIcon $color="#FF3B3B">
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
            <SummaryIcon $color="#FFB800">
              <Target size={22} />
            </SummaryIcon>
          </Flex>
        </SummaryCard>
      </Grid>

      <ChartsSection>
        <ChartCard $animate>
          <ChartHeader>
            <div>
              <Label>Spending Trend</Label>
              <Text style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
                {formatCurrency(totalFilteredSpending, 'EUR')}
              </Text>
            </div>
            <FilterTabList>
              <FilterTab $active={timeFilter === '7d'} onClick={() => setTimeFilter('7d')}>7D</FilterTab>
              <FilterTab $active={timeFilter === '30d'} onClick={() => setTimeFilter('30d')}>30D</FilterTab>
              <FilterTab $active={timeFilter === '90d'} onClick={() => setTimeFilter('90d')}>90D</FilterTab>
              <FilterTab $active={timeFilter === 'all'} onClick={() => setTimeFilter('all')}>All</FilterTab>
            </FilterTabList>
          </ChartHeader>
          <ChartContainer $animate>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066FF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0066FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0066FF"
                  strokeWidth={2}
                  fill="url(#spendingGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard $animate>
          <ChartHeader>
            <div>
              <Label>By Category</Label>
              <Text $muted $size="12px" style={{ marginTop: 4 }}>
                Top spending categories
              </Text>
            </div>
          </ChartHeader>
          <div>
            {spendingByCategory.slice(0, 5).map((item, index) => (
              <CategoryBar key={item.category}>
                <CategoryLabel style={{ textTransform: 'capitalize' }}>
                  {item.category}
                </CategoryLabel>
                <CategoryProgress>
                  <CategoryFill
                    $width={item.percentage}
                    $color={CATEGORY_COLORS[item.category]}
                    $delay={index * 0.1}
                  />
                </CategoryProgress>
                <CategoryAmount>
                  {formatCurrency(item.amount, 'EUR')}
                </CategoryAmount>
              </CategoryBar>
            ))}
          </div>
        </ChartCard>
      </ChartsSection>

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
