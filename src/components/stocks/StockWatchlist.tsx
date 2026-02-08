'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToWatchlist, removeFromWatchlist } from '@/store/stocksSlice';
import { useStockSimulation } from '@/hooks/useStockSimulation';
import {
  Card,
  Flex,
  Text,
  Label,
  Button,
  Badge,
  Select,
  PriceChange,
  LiveIndicator,
  theme,
} from '@/components/ui/styled';

const WatchlistCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled(Flex)`
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const StockItem = styled.div<{ $flash?: 'up' | 'down' | null }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${theme.colors.bgTertiary};
  border-radius: ${theme.radii.md};
  margin-bottom: 12px;
  transition: background 0.3s;

  ${({ $flash }) =>
    $flash === 'up' &&
    `background: rgba(0, 210, 106, 0.1);`}
  ${({ $flash }) =>
    $flash === 'down' &&
    `background: rgba(255, 59, 59, 0.1);`}

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const StockInfo = styled.div`
  flex: 1;
`;

const StockSymbol = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const StockName = styled.div`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  margin-top: 2px;
`;

const PriceSection = styled.div`
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const CurrentPrice = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text};
  font-variant-numeric: tabular-nums;
`;

const PriceStats = styled(Flex)`
  margin-top: 4px;
  gap: 8px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  margin-left: 12px;

  &:hover {
    background: ${theme.colors.bgSecondary};
    color: ${theme.colors.error};
  }

  @media (max-width: 768px) {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const AddSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${theme.colors.border};
`;

const StockSelect = styled(Select)`
  flex: 1;
  min-width: 150px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${theme.colors.textSecondary};
`;

export function StockWatchlist() {
  const dispatch = useAppDispatch();
  const { stocks, watchlist, connected } = useAppSelector((state) => state.stocks);
  const [selectedStock, setSelectedStock] = useState('');

  // Start real-time simulation
  useStockSimulation();

  const availableStocks = Object.keys(stocks).filter(
    (symbol) => !watchlist.find((item) => item.symbol === symbol)
  );

  const handleAddStock = () => {
    if (selectedStock) {
      dispatch(addToWatchlist(selectedStock));
      setSelectedStock('');
    }
  };

  const handleRemoveStock = (symbol: string) => {
    dispatch(removeFromWatchlist(symbol));
  };

  const formatPrice = (price: number, symbol: string) => {
    // Crypto uses more decimals
    const isCrypto = ['BTC', 'ETH'].includes(symbol);
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: isCrypto ? 2 : 2,
      maximumFractionDigits: isCrypto ? 2 : 2,
    });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toString();
  };

  return (
    <WatchlistCard $animate>
      <Header $justify="space-between" $align="center">
        <div>
          <Text style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            Watchlist
          </Text>
          <Text $muted $size="13px">
            {watchlist.length} assets tracked
          </Text>
        </div>
        {connected && <LiveIndicator>Live</LiveIndicator>}
      </Header>

      {watchlist.length === 0 ? (
        <EmptyState>
          <Text $muted>No assets in your watchlist</Text>
          <Text $muted $size="13px" style={{ marginTop: 8 }}>
            Add some stocks or crypto below
          </Text>
        </EmptyState>
      ) : (
        watchlist.map((item) => {
          const stock = stocks[item.symbol];
          if (!stock) return null;

          const isPositive = stock.change >= 0;

          return (
            <StockItem key={item.symbol} style={{ position: 'relative' }}>
              <StockInfo>
                <Flex $align="center" $gap="8px">
                  <StockSymbol>{stock.symbol}</StockSymbol>
                  <Badge $variant={isPositive ? 'success' : 'error'}>
                    {isPositive ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                  </Badge>
                </Flex>
                <StockName>{stock.name}</StockName>
              </StockInfo>

              <PriceSection>
                <CurrentPrice>{formatPrice(stock.price, stock.symbol)}</CurrentPrice>
                <PriceStats>
                  <PriceChange $positive={isPositive}>
                    {isPositive ? '+' : ''}{formatPrice(stock.change, stock.symbol)}
                  </PriceChange>
                  <Text $muted $size="12px">
                    Vol: {formatVolume(stock.volume)}
                  </Text>
                </PriceStats>
              </PriceSection>

              <RemoveButton
                onClick={() => handleRemoveStock(item.symbol)}
                aria-label={`Remove ${stock.symbol} from watchlist`}
                title="Remove from watchlist"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </RemoveButton>
            </StockItem>
          );
        })
      )}

      {availableStocks.length > 0 && (
        <AddSection>
          <Label style={{ marginBottom: 12, display: 'block' }}>Add to Watchlist</Label>
          <Flex $gap="12px" $wrap="wrap">
            <StockSelect
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              aria-label="Select stock to add"
            >
              <option value="">Select asset...</option>
              {availableStocks.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol} - {stocks[symbol].name}
                </option>
              ))}
            </StockSelect>
            <Button onClick={handleAddStock} disabled={!selectedStock}>
              Add
            </Button>
          </Flex>
        </AddSection>
      )}
    </WatchlistCard>
  );
}
