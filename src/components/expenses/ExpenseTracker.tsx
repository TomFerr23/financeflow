'use client';

import { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  UtensilsCrossed,
  Car,
  Film,
  ShoppingBag,
  FileText,
  Heart,
  Package,
  Trash2,
  Plus,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addExpense, removeExpense, setFilter } from '@/store/expensesSlice';
import { ExpenseCategory } from '@/types';
import {
  Card,
  Flex,
  Grid,
  Text,
  Label,
  Input,
  Select,
  Button,
  ChartCard,
  ChartHeader,
  ChartContainer,
  ChartTooltip,
  FilterTabList,
  FilterTab,
  SummaryCard,
  SummaryValue,
  SummaryLabel,
  SummaryIcon,
  theme,
} from '@/components/ui/styled';

const ExpensePageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
`;

const CategoryIcon = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CategoryInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CategoryName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.text};
  text-transform: capitalize;
`;

const CategoryProgress = styled.div`
  height: 6px;
  background: ${theme.colors.bgTertiary};
  border-radius: 3px;
  overflow: hidden;
  margin-top: 6px;
`;

const CategoryFill = styled.div<{ $width: number; $color: string; $delay: number }>`
  height: 100%;
  border-radius: 3px;
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
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
  text-align: right;
  min-width: 80px;
`;

const DonutCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const DonutContainer = styled.div`
  position: relative;
  height: 200px;
`;

const ExpenseForm = styled.form`
  display: grid;
  grid-template-columns: 120px 140px 1fr auto;
  gap: 12px;
  padding: 20px;
  background: ${theme.colors.bgTertiary};
  border-radius: 12px;
  margin-bottom: 20px;
  transition: background 0.3s;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;

    & > *:nth-child(3) {
      grid-column: 1 / -1;
    }

    & > *:nth-child(4) {
      grid-column: 1 / -1;
    }
  }
`;

const ExpenseList = styled.div`
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 3px;
  }
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${theme.colors.border};
  transition: background 0.2s, border-color 0.3s;

  &:hover {
    background: ${theme.colors.bgTertiary};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const ExpenseIconWrapper = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  margin-right: 14px;
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  transition: background 0.3s;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.errorLight};
    color: ${theme.colors.error};
  }
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterSection = styled(Flex)`
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// Category icons mapping
const CategoryIcons: Record<ExpenseCategory, React.FC<{ size?: number }>> = {
  food: UtensilsCrossed,
  transport: Car,
  entertainment: Film,
  shopping: ShoppingBag,
  bills: FileText,
  health: Heart,
  other: Package,
};

const categoryColors: Record<ExpenseCategory, string> = {
  food: '#FF6B6B',
  transport: '#4ECDC4',
  entertainment: '#A78BFA',
  shopping: '#F472B6',
  bills: '#60A5FA',
  health: '#34D399',
  other: '#9CA3AF',
};

const categoryLabels: Record<ExpenseCategory, string> = {
  food: 'Food & Dining',
  transport: 'Transport',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  bills: 'Bills & Utilities',
  health: 'Health',
  other: 'Other',
};

type TimeFilter = 'week' | 'month' | 'year' | 'all';

export function ExpenseTracker() {
  const dispatch = useAppDispatch();
  const { expenses, filter } = useAppSelector((state) => state.expenses);

  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'food' as ExpenseCategory,
    description: '',
  });

  // Filter expenses based on current filter
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;

    // Category filter
    if (filter.category !== 'all') {
      filtered = filtered.filter((exp) => exp.category === filter.category);
    }

    // Date range filter
    const now = new Date();
    if (filter.dateRange !== 'all') {
      const cutoffDate = new Date();
      switch (filter.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      filtered = filtered.filter((exp) => new Date(exp.date) >= cutoffDate);
    }

    return filtered;
  }, [expenses, filter]);

  // Calculate summary data
  const summary = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgPerDay = filteredExpenses.length > 0
      ? total / Math.max(1, new Set(filteredExpenses.map(e => e.date)).size)
      : 0;

    const byCategory = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return { total, avgPerDay, byCategory };
  }, [filteredExpenses]);

  // Spending over time for area chart
  const spendingOverTime = useMemo(() => {
    const grouped: Record<string, number> = {};

    filteredExpenses.forEach((exp) => {
      grouped[exp.date] = (grouped[exp.date] || 0) + exp.amount;
    });

    return Object.entries(grouped)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount,
        fullDate: date,
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
      .slice(-14);
  }, [filteredExpenses]);

  // Category data with percentages
  const categoryData = useMemo(() => {
    const total = Object.values(summary.byCategory).reduce((sum, val) => sum + val, 0);

    return Object.entries(summary.byCategory)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [summary.byCategory]);

  // Pie chart data
  const pieData = categoryData.map(item => ({
    name: categoryLabels[item.category],
    value: item.amount,
    color: categoryColors[item.category],
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description) return;

    dispatch(
      addExpense({
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        description: newExpense.description,
        date: new Date().toISOString().split('T')[0],
        currency: 'EUR',
      })
    );

    setNewExpense({ amount: '', category: 'food', description: '' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderCategoryIcon = (category: ExpenseCategory, size = 18) => {
    const IconComponent = CategoryIcons[category];
    return <IconComponent size={size} />;
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <ChartTooltip>
          <Text $size="12px" $muted>{label}</Text>
          <Text style={{ fontWeight: 600, marginTop: 4 }}>
            {formatCurrency(payload[0].value)}
          </Text>
        </ChartTooltip>
      );
    }
    return null;
  };

  const handleTimeFilterChange = (range: TimeFilter) => {
    dispatch(setFilter({ dateRange: range }));
  };

  return (
    <ExpensePageContainer>
      <PageHeader>
        <Text style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Expenses</Text>
        <Text $muted>Track and manage your spending</Text>
      </PageHeader>

      {/* Stats Row */}
      <StatRow>
        <SummaryCard $animate>
          <Flex $justify="space-between" $align="flex-start">
            <div>
              <SummaryLabel>Total Spent</SummaryLabel>
              <SummaryValue>{formatCurrency(summary.total)}</SummaryValue>
            </div>
            <SummaryIcon $color="#FF6B6B">
              <TrendingDown size={22} />
            </SummaryIcon>
          </Flex>
        </SummaryCard>

        <SummaryCard $animate>
          <Flex $justify="space-between" $align="flex-start">
            <div>
              <SummaryLabel>Daily Average</SummaryLabel>
              <SummaryValue>{formatCurrency(summary.avgPerDay)}</SummaryValue>
            </div>
            <SummaryIcon $color="#60A5FA">
              <Calendar size={22} />
            </SummaryIcon>
          </Flex>
        </SummaryCard>

        <SummaryCard $animate>
          <Flex $justify="space-between" $align="flex-start">
            <div>
              <SummaryLabel>Transactions</SummaryLabel>
              <SummaryValue>{filteredExpenses.length}</SummaryValue>
            </div>
            <SummaryIcon $color="#34D399">
              <FileText size={22} />
            </SummaryIcon>
          </Flex>
        </SummaryCard>
      </StatRow>

      {/* Charts Row */}
      <ChartsRow>
        {/* Spending Trend Chart */}
        <ChartCard $animate>
          <ChartHeader>
            <div>
              <Label>Spending Trend</Label>
              <Text $muted $size="12px" style={{ marginTop: 4 }}>
                Daily spending over time
              </Text>
            </div>
            <FilterTabList>
              <FilterTab
                $active={filter.dateRange === 'week'}
                onClick={() => handleTimeFilterChange('week')}
              >
                Week
              </FilterTab>
              <FilterTab
                $active={filter.dateRange === 'month'}
                onClick={() => handleTimeFilterChange('month')}
              >
                Month
              </FilterTab>
              <FilterTab
                $active={filter.dateRange === 'year'}
                onClick={() => handleTimeFilterChange('year')}
              >
                Year
              </FilterTab>
              <FilterTab
                $active={filter.dateRange === 'all'}
                onClick={() => handleTimeFilterChange('all')}
              >
                All
              </FilterTab>
            </FilterTabList>
          </ChartHeader>
          <ChartContainer $animate style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0} />
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
                  stroke="#FF6B6B"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        {/* Category Donut Chart */}
        <ChartCard $animate>
          <ChartHeader>
            <div>
              <Label>By Category</Label>
              <Text $muted $size="12px" style={{ marginTop: 4 }}>
                Spending distribution
              </Text>
            </div>
          </ChartHeader>
          <DonutContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={800}
                  animationBegin={200}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    boxShadow: 'var(--color-card-shadow)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <DonutCenter>
              <Text $muted $size="11px">Total</Text>
              <Text style={{ fontSize: 16, fontWeight: 700 }}>
                {formatCurrency(summary.total)}
              </Text>
            </DonutCenter>
          </DonutContainer>
        </ChartCard>
      </ChartsRow>

      {/* Category Breakdown */}
      <Card $animate style={{ marginBottom: 24 }}>
        <Label style={{ display: 'block', marginBottom: 16 }}>Category Breakdown</Label>
        {categoryData.length > 0 ? (
          categoryData.map((item, index) => (
            <CategoryBar key={item.category}>
              <CategoryIcon $color={categoryColors[item.category]}>
                {renderCategoryIcon(item.category, 18)}
              </CategoryIcon>
              <CategoryInfo>
                <Flex $justify="space-between" $align="center">
                  <CategoryName>{categoryLabels[item.category]}</CategoryName>
                  <Text $muted $size="12px">{item.percentage.toFixed(1)}%</Text>
                </Flex>
                <CategoryProgress>
                  <CategoryFill
                    $width={item.percentage}
                    $color={categoryColors[item.category]}
                    $delay={index * 0.1}
                  />
                </CategoryProgress>
              </CategoryInfo>
              <CategoryAmount>{formatCurrency(item.amount)}</CategoryAmount>
            </CategoryBar>
          ))
        ) : (
          <Text $muted style={{ textAlign: 'center', padding: 20 }}>
            No expenses to display
          </Text>
        )}
      </Card>

      {/* Add Expense Form */}
      <Card $animate style={{ marginBottom: 24 }}>
        <Label style={{ display: 'block', marginBottom: 16 }}>Add New Expense</Label>
        <ExpenseForm onSubmit={handleSubmit}>
          <Input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            aria-label="Expense amount"
            step="0.01"
            min="0"
          />
          <Select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
            aria-label="Expense category"
          >
            {Object.keys(categoryLabels).map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat as ExpenseCategory]}
              </option>
            ))}
          </Select>
          <Input
            type="text"
            placeholder="Description (e.g., Lunch at cafe)"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            aria-label="Expense description"
          />
          <Button type="submit" disabled={!newExpense.amount || !newExpense.description}>
            <Plus size={16} />
            Add
          </Button>
        </ExpenseForm>
      </Card>

      {/* Expense List */}
      <Card $animate>
        <FilterSection>
          <Label>Recent Transactions</Label>
          <Select
            value={filter.category}
            onChange={(e) => dispatch(setFilter({ category: e.target.value as ExpenseCategory | 'all' }))}
            style={{ minWidth: 150 }}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {Object.keys(categoryLabels).map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat as ExpenseCategory]}
              </option>
            ))}
          </Select>
        </FilterSection>

        <ExpenseList>
          {filteredExpenses.length === 0 ? (
            <Text $muted style={{ textAlign: 'center', padding: 40 }}>
              No expenses found. Add your first expense above!
            </Text>
          ) : (
            filteredExpenses.map((expense) => (
              <ExpenseItem key={expense.id}>
                <Flex $align="center">
                  <ExpenseIconWrapper $color={categoryColors[expense.category]}>
                    {renderCategoryIcon(expense.category, 20)}
                  </ExpenseIconWrapper>
                  <div>
                    <Text style={{ fontWeight: 500, marginBottom: 2 }}>{expense.description}</Text>
                    <Text $muted $size="12px">
                      {formatDate(expense.date)} · {categoryLabels[expense.category]}
                    </Text>
                  </div>
                </Flex>
                <Flex $align="center" $gap="12px">
                  <Text style={{
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    color: '#FF6B6B'
                  }}>
                    -{formatCurrency(expense.amount)}
                  </Text>
                  <DeleteButton
                    onClick={() => dispatch(removeExpense(expense.id))}
                    aria-label={`Delete expense: ${expense.description}`}
                  >
                    <Trash2 size={16} />
                  </DeleteButton>
                </Flex>
              </ExpenseItem>
            ))
          )}
        </ExpenseList>
      </Card>
    </ExpensePageContainer>
  );
}
