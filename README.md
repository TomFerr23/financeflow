# FinanceFlow 💰

A modern personal finance dashboard built with React, TypeScript, and Redux Toolkit. This project demonstrates proficiency in the modern frontend stack used by companies like Revolut.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux)
![Tests](https://img.shields.io/badge/Tests-24_passing-green)
![Coverage](https://img.shields.io/badge/Coverage-90%25+-brightgreen)

## 🚀 Live Demo

[View Live Demo](https://financeflow-demo.vercel.app) *(Deploy link)*

## ✨ Features

### 💱 Currency Converter
- Real-time exchange rates via [Frankfurter API](https://www.frankfurter.app/)
- Support for 10+ major currencies (EUR, USD, GBP, JPY, etc.)
- Conversion history tracking
- Swap currencies with one click

### 📈 Stock & Crypto Watchlist
- Real-time price updates (simulated WebSocket)
- Track stocks (AAPL, GOOGL, MSFT, AMZN, TSLA) and crypto (BTC, ETH)
- Add/remove assets from watchlist
- Live price change indicators with color coding
- 24h high/low and volume data

### 💰 Expense Tracker
- Add, edit, and delete expenses
- Category-based organization (Food, Transport, Entertainment, etc.)
- Interactive pie chart visualization
- Filter by category and date range (week/month/year)
- Running total calculations

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Redux Toolkit** | State Management |
| **styled-components** | CSS-in-JS Styling |
| **Recharts** | Data Visualization |
| **Jest** | Unit Testing |
| **React Testing Library** | Component Testing |
| **Next.js 16** | Framework & SSR |

## 📁 Project Structure

```
financeflow/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── currency/           # Currency converter
│   │   │   └── CurrencyConverter.tsx
│   │   ├── stocks/             # Stock watchlist
│   │   │   └── StockWatchlist.tsx
│   │   ├── expenses/           # Expense tracker
│   │   │   └── ExpenseTracker.tsx
│   │   ├── ui/                 # Shared UI components
│   │   │   └── styled.ts
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   └── Providers.tsx       # Redux provider
│   ├── store/
│   │   ├── index.ts            # Store configuration
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   ├── currencySlice.ts    # Currency state
│   │   ├── stocksSlice.ts      # Stocks state
│   │   └── expensesSlice.ts    # Expenses state
│   ├── hooks/
│   │   └── useStockSimulation.ts  # Real-time simulation
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── __tests__/
│       ├── currencySlice.test.ts
│       ├── stocksSlice.test.ts
│       └── expensesSlice.test.ts
├── jest.config.js
├── jest.setup.js
└── package.json
```

## 🧪 Testing

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/tomferrari/financeflow.git

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

## 🎯 Key Implementation Details

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

## 🎨 Design Decisions

1. **Dark Theme**: Inspired by modern fintech apps (Revolut, Robinhood)
2. **Mobile-First**: Responsive design that works on all devices
3. **Accessibility**: ARIA labels, keyboard navigation, focus indicators
4. **Performance**: Memoization, virtualization considerations for large lists

## 📝 What Went Well

- ✅ Clean separation of concerns with Redux slices
- ✅ Type-safe throughout with TypeScript
- ✅ Comprehensive test coverage from day one (TDD approach)
- ✅ Real API integration (Frankfurter) for currency rates
- ✅ Realistic stock simulation that mimics WebSocket behavior
- ✅ Polished UI with smooth animations
- ✅ styled-components for consistent, themeable styling
- ✅ Proper project structure following industry standards

## 🔄 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Real-time stock data requires paid API | Built realistic simulation with `setInterval` that mimics WebSocket behavior |
| styled-components SSR hydration warnings | Used `'use client'` directive appropriately in Next.js 16 |
| Complex expense filtering logic | Memoized filtered results with `useMemo` to prevent unnecessary recalculations |
| Chart responsiveness on mobile | Used `ResponsiveContainer` from Recharts + CSS media queries |
| Type safety with Redux | Created custom typed hooks (`useAppDispatch`, `useAppSelector`) |
| Testing async Redux actions | Used `createAsyncThunk` which integrates well with Jest |

## 🚧 Future Improvements

- [ ] Add Mermaid.js for dynamic architecture/flow diagrams
- [ ] Implement actual WebSocket connection for live stock data
- [ ] Add user authentication (OAuth)
- [ ] Persist data to localStorage or backend database
- [ ] Add more currencies and crypto assets
- [ ] Implement budget goals and spending alerts
- [ ] Add export to CSV/PDF functionality
- [ ] Add E2E tests with Cypress
- [ ] Implement dark/light theme toggle

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        React App                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Currency   │  │    Stocks    │  │   Expenses   │       │
│  │  Converter   │  │  Watchlist   │  │   Tracker    │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │               │
│         └────────────────┼─────────────────┘               │
│                          │                                  │
│                   ┌──────▼───────┐                          │
│                   │ Redux Store  │                          │
│                   ├──────────────┤                          │
│                   │ • currency   │                          │
│                   │ • stocks     │                          │
│                   │ • expenses   │                          │
│                   └──────┬───────┘                          │
│                          │                                  │
├──────────────────────────┼──────────────────────────────────┤
│                   ┌──────▼───────┐                          │
│                   │  External    │                          │
│                   │    APIs      │                          │
│                   ├──────────────┤                          │
│                   │ Frankfurter  │ (Currency rates)         │
│                   │ Simulated WS │ (Stock prices)           │
│                   └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## 👨‍💻 Author

**Tom Ferrari** - Frontend Engineer

- 🔗 LinkedIn: [tommaso-ferrari-it](https://linkedin.com/in/tommaso-ferrari-it)
- 💻 GitHub: [tomferrari](https://github.com/tomferrari)
- 📧 Email: tomferrari.dev@gmail.com
- 🌐 Portfolio: [tomferrari.dev](https://tomferrari.dev)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ as a portfolio project demonstrating modern React/TypeScript development practices.
