import expensesReducer, {
  addExpense,
  removeExpense,
  updateExpense,
  setFilter,
  clearExpenses,
} from '@/store/expensesSlice';
import { Expense } from '@/types';

describe('expensesSlice', () => {
  const mockExpense: Omit<Expense, 'id'> = {
    amount: 50.00,
    category: 'food',
    description: 'Lunch',
    date: '2024-01-15',
    currency: 'EUR',
  };

  const initialState = {
    expenses: [],
    loading: false,
    filter: {
      category: 'all' as const,
      dateRange: 'month' as const,
    },
  };

  describe('addExpense', () => {
    it('should add an expense with a generated id', () => {
      const newState = expensesReducer(initialState, addExpense(mockExpense));

      expect(newState.expenses).toHaveLength(1);
      expect(newState.expenses[0].id).toBeTruthy();
      expect(newState.expenses[0].amount).toBe(50.00);
      expect(newState.expenses[0].category).toBe('food');
    });

    it('should add new expenses at the beginning of the list', () => {
      let state = initialState;

      state = expensesReducer(state, addExpense({ ...mockExpense, description: 'First' }));
      state = expensesReducer(state, addExpense({ ...mockExpense, description: 'Second' }));

      expect(state.expenses[0].description).toBe('Second');
      expect(state.expenses[1].description).toBe('First');
    });
  });

  describe('removeExpense', () => {
    it('should remove an expense by id', () => {
      let state = expensesReducer(initialState, addExpense(mockExpense));
      const expenseId = state.expenses[0].id;

      state = expensesReducer(state, removeExpense(expenseId));
      expect(state.expenses).toHaveLength(0);
    });

    it('should not affect other expenses', () => {
      let state = initialState;
      state = expensesReducer(state, addExpense({ ...mockExpense, description: 'Keep' }));
      state = expensesReducer(state, addExpense({ ...mockExpense, description: 'Remove' }));

      const removeId = state.expenses[0].id; // 'Remove' is at index 0
      state = expensesReducer(state, removeExpense(removeId));

      expect(state.expenses).toHaveLength(1);
      expect(state.expenses[0].description).toBe('Keep');
    });
  });

  describe('updateExpense', () => {
    it('should update an existing expense', () => {
      let state = expensesReducer(initialState, addExpense(mockExpense));
      const expense = state.expenses[0];

      const updatedExpense = { ...expense, amount: 75.00, description: 'Updated Lunch' };
      state = expensesReducer(state, updateExpense(updatedExpense));

      expect(state.expenses[0].amount).toBe(75.00);
      expect(state.expenses[0].description).toBe('Updated Lunch');
    });

    it('should not add a new expense if id not found', () => {
      const state = expensesReducer(initialState, addExpense(mockExpense));

      const fakeExpense: Expense = {
        id: 'fake-id',
        ...mockExpense,
      };

      const newState = expensesReducer(state, updateExpense(fakeExpense));
      expect(newState.expenses).toHaveLength(1);
    });
  });

  describe('setFilter', () => {
    it('should update category filter', () => {
      const newState = expensesReducer(initialState, setFilter({ category: 'food' }));
      expect(newState.filter.category).toBe('food');
      expect(newState.filter.dateRange).toBe('month'); // Unchanged
    });

    it('should update dateRange filter', () => {
      const newState = expensesReducer(initialState, setFilter({ dateRange: 'year' }));
      expect(newState.filter.dateRange).toBe('year');
      expect(newState.filter.category).toBe('all'); // Unchanged
    });

    it('should update multiple filters at once', () => {
      const newState = expensesReducer(
        initialState,
        setFilter({ category: 'transport', dateRange: 'week' })
      );

      expect(newState.filter.category).toBe('transport');
      expect(newState.filter.dateRange).toBe('week');
    });
  });

  describe('clearExpenses', () => {
    it('should remove all expenses', () => {
      let state = initialState;
      state = expensesReducer(state, addExpense(mockExpense));
      state = expensesReducer(state, addExpense({ ...mockExpense, description: 'Another' }));

      state = expensesReducer(state, clearExpenses());
      expect(state.expenses).toHaveLength(0);
    });
  });
});
