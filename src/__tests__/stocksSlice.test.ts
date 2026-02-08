import stocksReducer, {
  updateStockPrice,
  addToWatchlist,
  removeFromWatchlist,
  setConnected,
} from '@/store/stocksSlice';

describe('stocksSlice', () => {
  const initialState = {
    stocks: {
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
    },
    watchlist: [{ symbol: 'AAPL', addedAt: Date.now() }],
    loading: false,
    error: null,
    connected: false,
  };

  describe('updateStockPrice', () => {
    it('should update the price of an existing stock', () => {
      const newState = stocksReducer(
        initialState,
        updateStockPrice({ symbol: 'AAPL', price: 180.00 })
      );

      expect(newState.stocks.AAPL.price).toBe(180.00);
      expect(newState.stocks.AAPL.lastUpdate).toBeGreaterThan(0);
    });

    it('should update high24h if new price is higher', () => {
      const newState = stocksReducer(
        initialState,
        updateStockPrice({ symbol: 'AAPL', price: 185.00 })
      );

      expect(newState.stocks.AAPL.high24h).toBe(185.00);
    });

    it('should update low24h if new price is lower', () => {
      const newState = stocksReducer(
        initialState,
        updateStockPrice({ symbol: 'AAPL', price: 170.00 })
      );

      expect(newState.stocks.AAPL.low24h).toBe(170.00);
    });

    it('should calculate change and changePercent correctly', () => {
      // Original price: 178.52, original change: 2.34
      // So yesterday's close was 178.52 - 2.34 = 176.18
      const newState = stocksReducer(
        initialState,
        updateStockPrice({ symbol: 'AAPL', price: 180.00 })
      );

      // New change should be 180.00 - 176.18 = 3.82
      expect(newState.stocks.AAPL.change).toBeCloseTo(3.82, 1);
    });
  });

  describe('addToWatchlist', () => {
    it('should add a stock to the watchlist', () => {
      const stateWithMoreStocks = {
        ...initialState,
        stocks: {
          ...initialState.stocks,
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
        },
      };

      const newState = stocksReducer(stateWithMoreStocks, addToWatchlist('GOOGL'));
      expect(newState.watchlist).toHaveLength(2);
      expect(newState.watchlist.find((item) => item.symbol === 'GOOGL')).toBeTruthy();
    });

    it('should not add duplicate stocks to watchlist', () => {
      const newState = stocksReducer(initialState, addToWatchlist('AAPL'));
      expect(newState.watchlist).toHaveLength(1);
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove a stock from the watchlist', () => {
      const newState = stocksReducer(initialState, removeFromWatchlist('AAPL'));
      expect(newState.watchlist).toHaveLength(0);
    });

    it('should not affect watchlist if symbol not found', () => {
      const newState = stocksReducer(initialState, removeFromWatchlist('GOOGL'));
      expect(newState.watchlist).toHaveLength(1);
    });
  });

  describe('setConnected', () => {
    it('should update the connected state', () => {
      const newState = stocksReducer(initialState, setConnected(true));
      expect(newState.connected).toBe(true);
    });
  });
});
