import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense, ExpenseCategory } from '@/types';

interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  filter: {
    category: ExpenseCategory | 'all';
    dateRange: 'week' | 'month' | 'year' | 'all';
  };
}

// Generate some sample expenses
const generateSampleExpenses = (): Expense[] => {
  const categories: ExpenseCategory[] = ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health'];
  const descriptions: Record<ExpenseCategory, string[]> = {
    food: ['Grocery Store', 'Restaurant', 'Coffee Shop', 'Food Delivery'],
    transport: ['Uber', 'Gas Station', 'Metro Card', 'Parking'],
    entertainment: ['Netflix', 'Cinema', 'Concert Tickets', 'Spotify'],
    shopping: ['Amazon', 'Clothing Store', 'Electronics', 'Home Goods'],
    bills: ['Electricity', 'Internet', 'Phone Bill', 'Insurance'],
    health: ['Pharmacy', 'Gym Membership', 'Doctor Visit', 'Supplements'],
    other: ['Miscellaneous'],
  };

  const expenses: Expense[] = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const desc = descriptions[category][Math.floor(Math.random() * descriptions[category].length)];
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));

    expenses.push({
      id: `exp-${i}-${Date.now()}`,
      amount: Math.round((Math.random() * 150 + 5) * 100) / 100,
      category,
      description: desc,
      date: date.toISOString().split('T')[0],
      currency: 'EUR',
    });
  }

  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const initialState: ExpensesState = {
  expenses: generateSampleExpenses(),
  loading: false,
  filter: {
    category: 'all',
    dateRange: 'month',
  },
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Omit<Expense, 'id'>>) => {
      const newExpense: Expense = {
        ...action.payload,
        id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      state.expenses.unshift(newExpense);
    },
    removeExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter((exp) => exp.id !== action.payload);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex((exp) => exp.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    setFilter: (state, action: PayloadAction<Partial<ExpensesState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearExpenses: (state) => {
      state.expenses = [];
    },
  },
});

export const { addExpense, removeExpense, updateExpense, setFilter, clearExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;
