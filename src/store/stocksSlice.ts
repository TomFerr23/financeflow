import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stock, WatchlistItem } from '@/types';

interface StocksState {
  stocks: Record<string, Stock>;
  watchlist: WatchlistItem[];
  loading: boolean;
  error: string | null;
  connected: boolean;
}

// Simulated stock data (realistic initial prices)
const initialStocks: Record<string, Stock> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.52,
    change: 2.34,
    changePercent: 1.33,
    high24h: 180.15,
    low24h: 175.80,
    volume: 52400000,
    lastUpdate: Date.now(),
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 141.28,
    change: -0.87,
    changePercent: -0.61,
    high24h: 143.20,
    low24h: 140.10,
    volume: 21300000,
    lastUpdate: Date.now(),
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 378.91,
    change: 4.21,
    changePercent: 1.12,
    high24h: 381.50,
    low24h: 374.30,
    volume: 18700000,
    lastUpdate: Date.now(),
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.25,
    change: 1.56,
    changePercent: 0.88,
    high24h: 179.80,
    low24h: 176.20,
    volume: 32100000,
    lastUpdate: Date.now(),
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.50,
    change: -5.32,
    changePercent: -2.10,
    high24h: 255.80,
    low24h: 245.10,
    volume: 89500000,
    lastUpdate: Date.now(),
  },
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 43250.00,
    change: 850.00,
    changePercent: 2.01,
    high24h: 44100.00,
    low24h: 42100.00,
    volume: 28500000000,
    lastUpdate: Date.now(),
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2280.50,
    change: 45.30,
    changePercent: 2.03,
    high24h: 2320.00,
    low24h: 2210.00,
    volume: 12300000000,
    lastUpdate: Date.now(),
  },
};

const initialState: StocksState = {
  stocks: initialStocks,
  watchlist: [
    { symbol: 'AAPL', addedAt: Date.now() },
    { symbol: 'BTC', addedAt: Date.now() },
    { symbol: 'TSLA', addedAt: Date.now() },
  ],
  loading: false,
  error: null,
  connected: false,
};

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    updateStockPrice: (state, action: PayloadAction<{ symbol: string; price: number }>) => {
      const { symbol, price } = action.payload;
      const stock = state.stocks[symbol];
      if (stock) {
        const change = price - (stock.price - stock.change);
        const changePercent = (change / (stock.price - stock.change)) * 100;

        state.stocks[symbol] = {
          ...stock,
          price,
          change,
          changePercent,
          high24h: Math.max(stock.high24h, price),
          low24h: Math.min(stock.low24h, price),
          lastUpdate: Date.now(),
        };
      }
    },
    addToWatchlist: (state, action: PayloadAction<string>) => {
      const symbol = action.payload;
      if (!state.watchlist.find((item) => item.symbol === symbol)) {
        state.watchlist.push({ symbol, addedAt: Date.now() });
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter((item) => item.symbol !== action.payload);
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  updateStockPrice,
  addToWatchlist,
  removeFromWatchlist,
  setConnected,
  setLoading,
} = stocksSlice.actions;

export default stocksSlice.reducer;
