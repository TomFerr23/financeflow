import type { FC, ReactNode } from 'react';

// Currency Types
export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  symbol: string;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;
}

// Stock Types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  lastUpdate: number;
}

export interface WatchlistItem {
  symbol: string;
  addedAt: number;
  alertPrice?: number;
}

// Expense Types
export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  currency: string;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'other';

export interface ExpenseSummary {
  total: number;
  byCategory: Record<ExpenseCategory, number>;
  byMonth: Record<string, number>;
}

// User/Account Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memberSince: string;
}

export interface UserBalance {
  total: number;
  currency: string;
}

export interface UserSettings {
  defaultCurrency: string;
  notifications: boolean;
}

// UI Types
export interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export type PageId = 'overview' | 'currency' | 'stocks' | 'expenses' | 'settings';

export interface NavItem {
  id: PageId;
  label: string;
  Icon: FC<{ size?: number }>;
}
