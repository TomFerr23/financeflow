'use client';

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRates, addConversion } from '@/store/currencySlice';
import {
  Card,
  Flex,
  Input,
  Select,
  Button,
  Text,
  Label,
  Skeleton,
  theme,
} from '@/components/ui/styled';

const ConverterCard = styled(Card)`
  max-width: 500px;
  margin: 0 auto;
`;

const CurrencyInput = styled.div`
  position: relative;
  width: 100%;
`;

const CurrencyInputField = styled(Input)`
  padding-right: 100px;
  font-size: 24px;
  font-weight: 600;
  height: 64px;

  @media (max-width: 768px) {
    font-size: 20px;
    height: 56px;
  }
`;

const CurrencySelect = styled(Select)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  padding: 8px;
  font-size: 14px;
  font-weight: 600;
  background: ${theme.colors.bgSecondary};
`;

const SwapButton = styled(Button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 0;
  margin: 16px auto;
  display: flex;
`;

const ResultDisplay = styled.div`
  text-align: center;
  padding: 20px;
  background: ${theme.colors.bgTertiary};
  border-radius: ${theme.radii.md};
  margin-top: 16px;
`;

const ResultAmount = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.text};

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const RateInfo = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`;

const HistoryList = styled.div`
  margin-top: 24px;
  border-top: 1px solid ${theme.colors.border};
  padding-top: 16px;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export function CurrencyConverter() {
  const dispatch = useAppDispatch();
  const { rates, loading, lastUpdated, conversions } = useAppSelector((state) => state.currency);

  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');

  // Fetch rates on mount and when base currency changes
  useEffect(() => {
    dispatch(fetchRates(fromCurrency));
  }, [dispatch, fromCurrency]);

  const currencyCodes = Object.keys(rates);

  const convertedAmount = useCallback(() => {
    if (!rates[toCurrency] || !amount) return 0;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    return numAmount * rates[toCurrency].rate;
  }, [rates, toCurrency, amount]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvert = () => {
    const result = convertedAmount();
    if (result > 0) {
      dispatch(
        addConversion({
          from: fromCurrency,
          to: toCurrency,
          amount: parseFloat(amount),
          result,
          rate: rates[toCurrency]?.rate || 0,
          timestamp: Date.now(),
        })
      );
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && currencyCodes.length === 0) {
    return (
      <ConverterCard $animate>
        <Flex $direction="column" $gap="16px">
          <Skeleton $height="64px" />
          <Skeleton $height="48px" $width="48px" />
          <Skeleton $height="64px" />
          <Skeleton $height="100px" />
        </Flex>
      </ConverterCard>
    );
  }

  return (
    <ConverterCard $animate>
      <Flex $direction="column" $gap="8px">
        <Label>You send</Label>
        <CurrencyInput>
          <CurrencyInputField
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            aria-label="Amount to convert"
          />
          <CurrencySelect
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            aria-label="From currency"
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </CurrencySelect>
        </CurrencyInput>
      </Flex>

      <SwapButton
        $variant="secondary"
        onClick={handleSwap}
        aria-label="Swap currencies"
        title="Swap currencies"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
        </svg>
      </SwapButton>

      <Flex $direction="column" $gap="8px">
        <Label>They receive</Label>
        <CurrencyInput>
          <CurrencyInputField
            type="text"
            value={convertedAmount().toFixed(2)}
            readOnly
            aria-label="Converted amount"
          />
          <CurrencySelect
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            aria-label="To currency"
          >
            {currencyCodes.filter((code) => code !== fromCurrency).map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </CurrencySelect>
        </CurrencyInput>
      </Flex>

      <ResultDisplay>
        <ResultAmount>
          {formatCurrency(convertedAmount(), toCurrency)}
        </ResultAmount>
        <RateInfo>
          1 {fromCurrency} = {rates[toCurrency]?.rate.toFixed(4) || '...'} {toCurrency}
          {lastUpdated && (
            <span style={{ marginLeft: 8 }}>
              • Updated {formatTime(lastUpdated)}
            </span>
          )}
        </RateInfo>
      </ResultDisplay>

      <Button
        onClick={handleConvert}
        style={{ width: '100%', marginTop: 16 }}
        disabled={!amount || parseFloat(amount) <= 0}
      >
        Convert
      </Button>

      {conversions.length > 0 && (
        <HistoryList>
          <Label>Recent Conversions</Label>
          {conversions.slice(0, 5).map((conv, i) => (
            <HistoryItem key={i}>
              <Text>
                {formatCurrency(conv.amount, conv.from)} → {formatCurrency(conv.result, conv.to)}
              </Text>
              <Text $muted $size="12px">
                {formatTime(conv.timestamp)}
              </Text>
            </HistoryItem>
          ))}
        </HistoryList>
      )}
    </ConverterCard>
  );
}
