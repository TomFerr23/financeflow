# FinanceFlow

A modern personal finance dashboard built with React, TypeScript, and Redux Toolkit. This project demonstrates proficiency in the modern frontend stack used by leading fintech companies.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux)
![Tests](https://img.shields.io/badge/Tests-24_passing-green)
![Coverage](https://img.shields.io/badge/Coverage-90%25+-brightgreen)

## Live Demo

[View Live Demo](https://financeflow-demo.vercel.app) *(Deploy link)*

---

## Features

### Currency Converter
- Real-time exchange rates via [Frankfurter API](https://www.frankfurter.app/)
- Support for 10+ major currencies (EUR, USD, GBP, JPY, etc.)
- Conversion history tracking
- Swap currencies with one click

### Stock & Crypto Watchlist
- Real-time price updates (simulated WebSocket)
- Track stocks (AAPL, GOOGL, MSFT, AMZN, TSLA) and crypto (BTC, ETH)
- Add/remove assets from watchlist
- Live price change indicators with color coding
- 24h high/low and volume data

### Expense Tracker
- Add, edit, and delete expenses
- Category-based organization (Food, Transport, Entertainment, etc.)
- Interactive pie chart visualization
- Filter by category and date range (week/month/year)
- Running total calculations

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Redux Toolkit** | State Management |
| **styled-components** | CSS-in-JS Styling |
| **Lucide React** | Icon System |
| **Recharts** | Data Visualization |
| **Jest** | Unit Testing |
| **React Testing Library** | Component Testing |
| **Next.js 16** | Framework & SSR |

---

## Architecture

```
                         ╔═══════════════════════════════════════════════════════════════╗
                         ║                      FINANCEFLOW APP                          ║
                         ╚═══════════════════════════════════════════════════════════════╝
                                                      │
                    ┌─────────────────────────────────┼─────────────────────────────────┐
                    │                                 │                                 │
                    ▼                                 ▼                                 ▼
    ┌───────────────────────────────┐  ┌───────────────────────────────┐  ┌───────────────────────────────┐
    │                               │  │                               │  │                               │
    │      CURRENCY CONVERTER       │  │      STOCK WATCHLIST          │  │      EXPENSE TRACKER          │
    │                               │  │                               │  │                               │
    │   ┌─────────────────────┐     │  │   ┌─────────────────────┐     │  │   ┌─────────────────────┐     │
    │   │  Real-time Rates    │     │  │   │  Live Price Feed    │     │  │   │  CRUD Operations    │     │
    │   │  Conversion History │     │  │   │  Portfolio Track    │     │  │   │  Category Filter    │     │
    │   │  Multi-currency     │     │  │   │  Trend Indicators   │     │  │   │  Chart Viz          │     │
    │   └─────────────────────┘     │  │   └─────────────────────┘     │  │   └─────────────────────┘     │
    │                               │  │                               │  │                               │
    └───────────────┬───────────────┘  └───────────────┬───────────────┘  └───────────────┬───────────────┘
                    │                                  │                                  │
                    │                                  │                                  │
                    └──────────────────────────────────┼──────────────────────────────────┘
                                                       │
                                                       ▼
                    ┌──────────────────────────────────────────────────────────────────────┐
                    │                                                                      │
                    │                           REDUX STORE                                │
                    │                                                                      │
                    │    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
                    │    │  currencySlice  │  │   stocksSlice   │  │  expensesSlice  │    │
                    │    ├─────────────────┤  ├─────────────────┤  ├─────────────────┤    │
                    │    │ rates           │  │ stocks          │  │ expenses        │    │
                    │    │ baseCurrency    │  │ watchlist       │  │ filter          │    │
                    │    │ conversions     │  │ connected       │  │ loading         │    │
                    │    │ lastUpdated     │  │ lastUpdate      │  │                 │    │
                    │    └─────────────────┘  └─────────────────┘  └─────────────────┘    │
                    │                                                                      │
                    └──────────────────────────────────┬───────────────────────────────────┘
                                                       │
                    ┌──────────────────────────────────┴───────────────────────────────────┐
                    │                                                                      │
                    ▼                                                                      ▼
    ┌───────────────────────────────────────────┐              ┌───────────────────────────────────────────┐
    │                                           │              │                                           │
    │           FRANKFURTER API                 │              │         SIMULATED WEBSOCKET               │
    │                                           │              │                                           │
    │     Real exchange rates from ECB          │              │     setInterval-based price updates       │
    │     Free, no API key required             │              │     Mimics real-time data feed            │
    │     30+ currency pairs                    │              │     2-second refresh interval             │
    │                                           │              │                                           │
    └───────────────────────────────────────────┘              └───────────────────────────────────────────┘
```

---

## Data Flow

```
    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                                                                                         │
    │   USER ACTION                                                                           │
    │   (click, input, submit)                                                                │
    │                                                                                         │
    └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                  │
                                                  ▼
    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                                                                                         │
    │   DISPATCH ACTION                                                                       │
    │   dispatch(addExpense({ amount, category, description }))                               │
    │                                                                                         │
    └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                  │
                              ┌───────────────────┴───────────────────┐
                              │                                       │
                              ▼                                       ▼
    ┌─────────────────────────────────────────┐     ┌─────────────────────────────────────────┐
    │                                         │     │                                         │
    │   SYNC ACTION                           │     │   ASYNC THUNK                           │
    │                                         │     │                                         │
    │   Immediate state update                │     │   API call → pending → fulfilled        │
    │   addExpense, removeExpense             │     │   fetchRates, fetchStockData            │
    │   setFilter, updateStockPrice           │     │                                         │
    │                                         │     │                                         │
    └──────────────────┬──────────────────────┘     └──────────────────┬──────────────────────┘
                       │                                               │
                       └───────────────────┬───────────────────────────┘
                                           │
                                           ▼
    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                                                                                         │
    │   REDUCER                                                                               │
    │   Pure function: (state, action) => newState                                            │
    │                                                                                         │
    └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                  │
                                                  ▼
    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                                                                                         │
    │   COMPONENT RE-RENDER                                                                   │
    │   useAppSelector subscribes to state changes                                            │
    │   UI updates automatically via React                                                    │
    │                                                                                         │
    └─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
financeflow/
├── src/
│   ├── app/                          # Next.js app router
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Main page entry
│   │   └── globals.css               # Global styles
│   │
│   ├── components/
│   │   ├── currency/                 # Currency converter module
│   │   │   └── CurrencyConverter.tsx
│   │   ├── stocks/                   # Stock watchlist module
│   │   │   └── StockWatchlist.tsx
│   │   ├── expenses/                 # Expense tracker module
│   │   │   └── ExpenseTracker.tsx
│   │   ├── ui/                       # Shared UI components
│   │   │   └── styled.ts             # Styled-components theme
│   │   ├── Dashboard.tsx             # Tab-based dashboard
│   │   └── Providers.tsx             # Redux provider wrapper
│   │
│   ├── store/
│   │   ├── index.ts                  # Store configuration
│   │   ├── hooks.ts                  # Typed Redux hooks
│   │   ├── currencySlice.ts          # Currency state + async thunks
│   │   ├── stocksSlice.ts            # Stocks state management
│   │   └── expensesSlice.ts          # Expenses CRUD operations
│   │
│   ├── hooks/
│   │   └── useStockSimulation.ts     # Real-time price simulation
│   │
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript types
│   │
│   └── __tests__/
│       ├── currencySlice.test.ts     # 6 tests
│       ├── stocksSlice.test.ts       # 8 tests
│       └── expensesSlice.test.ts     # 10 tests
│
├── jest.config.js                    # Jest configuration
├── jest.setup.js                     # Test environment setup
└── package.json
```

---

## Testing

The project follows TDD principles with comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

| Slice | Tests | Coverage |
|-------|-------|----------|
| Currency | 6 | 100% |
| Stocks | 8 | 100% |
| Expenses | 10 | 100% |
| **Total** | **24** | **~95%** |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/TomFerr23/financeflow.git

# Navigate to project directory
cd financeflow

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## Key Implementation Details

### State Management with Redux Toolkit

```typescript
// Example: Currency slice with async thunk
export const fetchRates = createAsyncThunk(
  'currency/fetchRates',
  async (baseCurrency: string = 'EUR') => {
    const response = await fetch(`${API_URL}/latest?from=${baseCurrency}`);
    const data = await response.json();
    return { rates: data.rates, base: baseCurrency };
  }
);
```

### Real-time Data Simulation

```typescript
// Custom hook for simulating WebSocket-like updates
export function useStockSimulation() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate price fluctuations
      dispatch(updateStockPrice({ symbol, price: newPrice }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
}
```

### Typed Redux Hooks

```typescript
// Properly typed hooks for type-safe Redux usage
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## Design Decisions

1. **Dark Theme**: Inspired by modern fintech apps (Revolut, Robinhood)
2. **Mobile-First**: Responsive design that works on all devices
3. **Accessibility**: ARIA labels, keyboard navigation, focus indicators
4. **Performance**: Memoization, virtualization considerations for large lists
5. **Icon System**: Lucide React for consistent, scalable vector icons

---

## What Went Well

- Clean separation of concerns with Redux slices
- Type-safe throughout with TypeScript
- Comprehensive test coverage from day one (TDD approach)
- Real API integration (Frankfurter) for currency rates
- Realistic stock simulation that mimics WebSocket behavior
- Polished UI with smooth animations
- styled-components for consistent, themeable styling
- Professional icon system with Lucide React
- Proper project structure following industry standards

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Real-time stock data requires paid API | Built realistic simulation with `setInterval` that mimics WebSocket behavior |
| styled-components SSR hydration warnings | Used `'use client'` directive appropriately in Next.js 16 |
| Complex expense filtering logic | Memoized filtered results with `useMemo` to prevent unnecessary recalculations |
| Chart responsiveness on mobile | Used `ResponsiveContainer` from Recharts + CSS media queries |
| Type safety with Redux | Created custom typed hooks (`useAppDispatch`, `useAppSelector`) |
| Testing async Redux actions | Used `createAsyncThunk` which integrates well with Jest |

---

## Future Improvements

- [ ] Implement actual WebSocket connection for live stock data
- [ ] Add user authentication (OAuth)
- [ ] Persist data to localStorage or backend database
- [ ] Add more currencies and crypto assets
- [ ] Implement budget goals and spending alerts
- [ ] Add export to CSV/PDF functionality
- [ ] Add E2E tests with Cypress
- [ ] Implement dark/light theme toggle

---

## Author

**Tom Ferrari** - Frontend Engineer

- LinkedIn: [tommaso-ferrari-it](https://linkedin.com/in/tommaso-ferrari-it)
- GitHub: [TomFerr23](https://github.com/TomFerr23)
- Email: tomferrari.dev@gmail.com
- Portfolio: [tomferrari.dev](https://tomferrari.dev)

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built as a portfolio project demonstrating modern React/TypeScript development practices.
