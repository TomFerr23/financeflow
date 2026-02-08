import currencyReducer, {
  setBaseCurrency,
  addConversion,
  clearConversions,
} from '@/store/currencySlice';

describe('currencySlice', () => {
  const initialState = {
    rates: {},
    baseCurrency: 'EUR',
    conversions: [],
    loading: false,
    error: null,
    lastUpdated: null,
  };

  describe('setBaseCurrency', () => {
    it('should update the base currency', () => {
      const newState = currencyReducer(initialState, setBaseCurrency('USD'));
      expect(newState.baseCurrency).toBe('USD');
    });

    it('should not affect other state properties', () => {
      const newState = currencyReducer(initialState, setBaseCurrency('GBP'));
      expect(newState.loading).toBe(false);
      expect(newState.conversions).toEqual([]);
    });
  });

  describe('addConversion', () => {
    it('should add a conversion to the beginning of the list', () => {
      const conversion = {
        from: 'EUR',
        to: 'USD',
        amount: 100,
        result: 110,
        rate: 1.1,
        timestamp: Date.now(),
      };

      const newState = currencyReducer(initialState, addConversion(conversion));
      expect(newState.conversions).toHaveLength(1);
      expect(newState.conversions[0]).toEqual(conversion);
    });

    it('should keep only the last 10 conversions', () => {
      let state = initialState;

      // Add 12 conversions
      for (let i = 0; i < 12; i++) {
        state = currencyReducer(
          state,
          addConversion({
            from: 'EUR',
            to: 'USD',
            amount: i,
            result: i * 1.1,
            rate: 1.1,
            timestamp: Date.now() + i,
          })
        );
      }

      expect(state.conversions).toHaveLength(10);
      // Most recent should be first
      expect(state.conversions[0].amount).toBe(11);
    });
  });

  describe('clearConversions', () => {
    it('should clear all conversions', () => {
      const stateWithConversions = {
        ...initialState,
        conversions: [
          { from: 'EUR', to: 'USD', amount: 100, result: 110, rate: 1.1, timestamp: Date.now() },
        ],
      };

      const newState = currencyReducer(stateWithConversions, clearConversions());
      expect(newState.conversions).toEqual([]);
    });
  });
});
