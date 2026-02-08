'use client';

import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
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
  Badge,
  theme,
} from '@/components/ui/styled';

const ExpenseCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
`;

const SummaryCard = styled.div`
  background: ${theme.colors.bgTertiary};
  border-radius: ${theme.radii.md};
  padding: 20px;
  text-align: center;
`;

const TotalAmount = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ChartContainer = styled.div`
  height: 200px;
  margin: 20px 0;
`;

const ExpenseForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr auto;
  gap: 12px;
  padding: 20px;
  background: ${theme.colors.bgTertiary};
  border-radius: ${theme.radii.md};
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ExpenseList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const CategoryIcon = styled.span<{ $category: ExpenseCategory }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${theme.radii.md};
  font-size: 18px;
  margin-right: 12px;
  background: ${({ $category }) => {
    const colors: Record<ExpenseCategory, string> = {
      food: 'rgba(255, 149, 0, 0.1)',
      transport: 'rgba(0, 122, 255, 0.1)',
      entertainment: 'rgba(175, 82, 222, 0.1)',
      shopping: 'rgba(255, 45, 85, 0.1)',
      bills: 'rgba(88, 86, 214, 0.1)',
      health: 'rgba(0, 210, 106, 0.1)',
      other: 'rgba(142, 142, 147, 0.1)',
    };
    return colors[$category];
  }};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 59, 59, 0.1);
    color: ${theme.colors.error};
  }
`;

const FilterBar = styled(Flex)`
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const categoryIcons: Record<ExpenseCategory, string> = {
  food: '🍔',
  transport: '🚗',
  entertainment: '🎬',
  shopping: '🛍️',
  bills: '📄',
  health: '💊',
  other: '📦',
};

const categoryColors: Record<ExpenseCategory, string> = {
  food: '#FF9500',
  transport: '#007AFF',
  entertainment: '#AF52DE',
  shopping: '#FF2D55',
  bills: '#5856D6',
  health: '#00D26A',
  other: '#8E8E93',
};

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

    const byCategory = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return { total, byCategory };
  }, [filteredExpenses]);

  // Chart data
  const pieData = Object.entries(summary.byCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: categoryColors[category as ExpenseCategory],
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

  return (
    <ExpenseCard $animate>
      {/* Summary Section */}
      <Grid $cols={2} $gap="16px" style={{ marginBottom: 24 }}>
        <SummaryCard>
          <Label>Total Spent</Label>
          <TotalAmount>{formatCurrency(summary.total)}</TotalAmount>
          <Text $muted $size="13px">
            {filteredExpenses.length} transactions
          </Text>
        </SummaryCard>

        <SummaryCard>
          <Label>Top Category</Label>
          {pieData.length > 0 ? (
            <>
              <TotalAmount style={{ fontSize: 24 }}>
                {categoryIcons[pieData.sort((a, b) => b.value - a.value)[0]?.name as ExpenseCategory]}
              </TotalAmount>
              <Text $muted $size="13px" style={{ textTransform: 'capitalize' }}>
                {pieData[0]?.name}
              </Text>
            </>
          ) : (
            <Text $muted>No data</Text>
          )}
        </SummaryCard>
      </Grid>

      {/* Chart */}
      {pieData.length > 0 && (
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  background: theme.colors.bgSecondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii.md,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {/* Category Legend */}
      <Flex $gap="8px" $wrap="wrap" $justify="center" style={{ marginBottom: 24 }}>
        {pieData.map((item) => (
          <Badge key={item.name} $variant="neutral" style={{ gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: item.color,
              }}
            />
            <span style={{ textTransform: 'capitalize' }}>{item.name}</span>
          </Badge>
        ))}
      </Flex>

      {/* Add Expense Form */}
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
          {Object.keys(categoryIcons).map((cat) => (
            <option key={cat} value={cat}>
              {categoryIcons[cat as ExpenseCategory]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </Select>
        <Input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          aria-label="Expense description"
        />
        <Button type="submit" disabled={!newExpense.amount || !newExpense.description}>
          Add
        </Button>
      </ExpenseForm>

      {/* Filters */}
      <FilterBar $gap="12px" $align="center">
        <Select
          value={filter.category}
          onChange={(e) => dispatch(setFilter({ category: e.target.value as ExpenseCategory | 'all' }))}
          style={{ minWidth: 120 }}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {Object.keys(categoryIcons).map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </Select>
        <Select
          value={filter.dateRange}
          onChange={(e) => dispatch(setFilter({ dateRange: e.target.value as 'week' | 'month' | 'year' | 'all' }))}
          style={{ minWidth: 120 }}
          aria-label="Filter by date range"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </Select>
      </FilterBar>

      {/* Expense List */}
      <ExpenseList>
        {filteredExpenses.length === 0 ? (
          <Text $muted style={{ textAlign: 'center', padding: 40 }}>
            No expenses found
          </Text>
        ) : (
          filteredExpenses.map((expense) => (
            <ExpenseItem key={expense.id}>
              <Flex $align="center">
                <CategoryIcon $category={expense.category}>
                  {categoryIcons[expense.category]}
                </CategoryIcon>
                <div>
                  <Text style={{ fontWeight: 500 }}>{expense.description}</Text>
                  <Text $muted $size="12px">
                    {formatDate(expense.date)} • {expense.category}
                  </Text>
                </div>
              </Flex>
              <Flex $align="center" $gap="12px">
                <Text style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  -{formatCurrency(expense.amount)}
                </Text>
                <DeleteButton
                  onClick={() => dispatch(removeExpense(expense.id))}
                  aria-label={`Delete expense: ${expense.description}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </DeleteButton>
              </Flex>
            </ExpenseItem>
          ))
        )}
      </ExpenseList>
    </ExpenseCard>
  );
}
