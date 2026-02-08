import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CurrencyRate, ConversionResult } from '@/types';

interface CurrencyState {
  rates: Record<string, CurrencyRate>;
  baseCurrency: string;
  conversions: ConversionResult[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: CurrencyState = {
  rates: {},
  baseCurrency: 'EUR',
  conversions: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Free API - no key required
const API_URL = 'https://api.frankfurter.app';

export const fetchRates = createAsyncThunk(
  'currency/fetchRates',
  async (baseCurrency: string = 'EUR') => {
    const response = await fetch(`${API_URL}/latest?from=${baseCurrency}`);
    if (!response.ok) throw new Error('Failed to fetch rates');
    const data = await response.json();
    return { rates: data.rates, base: baseCurrency };
  }
);

const currencyNames: Record<string, { name: string; symbol: string }> = {
  EUR: { name: 'Euro', symbol: '€' },
  USD: { name: 'US Dollar', symbol: '$' },
  GBP: { name: 'British Pound', symbol: '£' },
  JPY: { name: 'Japanese Yen', symbol: '¥' },
  CHF: { name: 'Swiss Franc', symbol: 'Fr' },
  AUD: { name: 'Australian Dollar', symbol: 'A$' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$' },
  PLN: { name: 'Polish Zloty', symbol: 'zł' },
  SEK: { name: 'Swedish Krona', symbol: 'kr' },
  NOK: { name: 'Norwegian Krone', symbol: 'kr' },
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setBaseCurrency: (state, action: PayloadAction<string>) => {
      state.baseCurrency = action.payload;
    },
    addConversion: (state, action: PayloadAction<ConversionResult>) => {
      state.conversions.unshift(action.payload);
      // Keep only last 10 conversions
      if (state.conversions.length > 10) {
        state.conversions = state.conversions.slice(0, 10);
      }
    },
    clearConversions: (state) => {
      state.conversions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = Date.now();

        // Add base currency with rate 1
        const rates: Record<string, CurrencyRate> = {
          [action.payload.base]: {
            code: action.payload.base,
            name: currencyNames[action.payload.base]?.name || action.payload.base,
            symbol: currencyNames[action.payload.base]?.symbol || action.payload.base,
            rate: 1,
          },
        };

        // Add fetched rates
        Object.entries(action.payload.rates).forEach(([code, rate]) => {
          rates[code] = {
            code,
            name: currencyNames[code]?.name || code,
            symbol: currencyNames[code]?.symbol || code,
            rate: rate as number,
          };
        });

        state.rates = rates;
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rates';
      });
  },
});

export const { setBaseCurrency, addConversion, clearConversions } = currencySlice.actions;
export default currencySlice.reducer;
