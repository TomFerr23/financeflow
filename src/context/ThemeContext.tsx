'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Dark theme (current)
export const darkTheme = {
  colors: {
    bg: '#0D0D0D',
    bgSecondary: '#1A1A1A',
    bgTertiary: '#252525',
    text: '#FFFFFF',
    textSecondary: '#8A8A8A',
    textMuted: '#5A5A5A',
    accent: '#0066FF',
    accentHover: '#0052CC',
    accentLight: 'rgba(0, 102, 255, 0.1)',
    success: '#00D26A',
    successLight: 'rgba(0, 210, 106, 0.1)',
    error: '#FF3B3B',
    errorLight: 'rgba(255, 59, 59, 0.1)',
    warning: '#FFB800',
    warningLight: 'rgba(255, 184, 0, 0.1)',
    border: '#2A2A2A',
    cardShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
    // Chart gradients
    gradientPrimary: 'linear-gradient(135deg, #0066FF 0%, #00D26A 100%)',
    gradientSecondary: 'linear-gradient(135deg, #FF3B3B 0%, #FFB800 100%)',
    gradientSuccess: 'linear-gradient(135deg, #00D26A 0%, #00FFB2 100%)',
    gradientAccent: 'linear-gradient(135deg, #0066FF 0%, #8B5CF6 100%)',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", "Fira Code", monospace',
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
};

// Light theme
export const lightTheme = {
  colors: {
    bg: '#F5F7FA',
    bgSecondary: '#FFFFFF',
    bgTertiary: '#EDF2F7',
    text: '#1A202C',
    textSecondary: '#4A5568',
    textMuted: '#A0AEC0',
    accent: '#0066FF',
    accentHover: '#0052CC',
    accentLight: 'rgba(0, 102, 255, 0.08)',
    success: '#00B85E',
    successLight: 'rgba(0, 184, 94, 0.1)',
    error: '#E53E3E',
    errorLight: 'rgba(229, 62, 62, 0.1)',
    warning: '#DD6B20',
    warningLight: 'rgba(221, 107, 32, 0.1)',
    border: '#E2E8F0',
    cardShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    // Chart gradients
    gradientPrimary: 'linear-gradient(135deg, #0066FF 0%, #00B85E 100%)',
    gradientSecondary: 'linear-gradient(135deg, #E53E3E 0%, #DD6B20 100%)',
    gradientSuccess: 'linear-gradient(135deg, #00B85E 0%, #38D9A9 100%)',
    gradientAccent: 'linear-gradient(135deg, #0066FF 0%, #805AD5 100%)',
  },
  fonts: darkTheme.fonts,
  radii: darkTheme.radii,
};

export type AppTheme = typeof darkTheme;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as ThemeMode;
    if (saved) {
      setMode(saved);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', mode);
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const value = {
    mode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useCurrentTheme(): AppTheme {
  const { mode } = useTheme();
  return mode === 'dark' ? darkTheme : lightTheme;
}
