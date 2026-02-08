'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateStockPrice, setConnected } from '@/store/stocksSlice';

/**
 * Custom hook that simulates real-time stock price updates
 * In a real app, this would connect to a WebSocket API
 */
export function useStockSimulation() {
  const dispatch = useAppDispatch();
  const { stocks, watchlist, connected } = useAppSelector((state) => state.stocks);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate WebSocket connection
    dispatch(setConnected(true));

    // Simulate price updates every 2 seconds
    intervalRef.current = setInterval(() => {
      watchlist.forEach((item) => {
        const stock = stocks[item.symbol];
        if (stock) {
          // Random price movement (-2% to +2%)
          const changePercent = (Math.random() - 0.5) * 0.04;
          const newPrice = stock.price * (1 + changePercent);

          dispatch(
            updateStockPrice({
              symbol: item.symbol,
              price: Math.round(newPrice * 100) / 100,
            })
          );
        }
      });
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      dispatch(setConnected(false));
    };
  }, [dispatch, watchlist.length]); // Only re-run if watchlist changes

  return { connected };
}
