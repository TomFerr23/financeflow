'use client';

import styled, { css, keyframes } from 'styled-components';

// Theme colors (Revolut-inspired dark theme)
export const theme = {
  colors: {
    bg: '#0D0D0D',
    bgSecondary: '#1A1A1A',
    bgTertiary: '#252525',
    text: '#FFFFFF',
    textSecondary: '#8A8A8A',
    textMuted: '#5A5A5A',
    accent: '#0066FF',
    accentHover: '#0052CC',
    success: '#00D26A',
    error: '#FF3B3B',
    warning: '#FFB800',
    border: '#2A2A2A',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", "Fira Code", monospace',
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Base Components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const Card = styled.div<{ $animate?: boolean }>`
  background: ${theme.colors.bgSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  padding: 24px;
  animation: ${({ $animate }) => ($animate ? css`${fadeIn} 0.3s ease-out` : 'none')};

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Flex = styled.div<{
  $gap?: string;
  $align?: string;
  $justify?: string;
  $direction?: string;
  $wrap?: string;
}>`
  display: flex;
  gap: ${({ $gap }) => $gap || '0'};
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  flex-direction: ${({ $direction }) => $direction || 'row'};
  flex-wrap: ${({ $wrap }) => $wrap || 'nowrap'};
`;

export const Grid = styled.div<{ $cols?: number; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 1}, 1fr);
  gap: ${({ $gap }) => $gap || '16px'};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Typography
export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
`;

export const Text = styled.p<{ $muted?: boolean; $size?: string }>`
  font-size: ${({ $size }) => $size || '14px'};
  color: ${({ $muted }) => ($muted ? theme.colors.textSecondary : theme.colors.text)};
  margin: 0;
  line-height: 1.5;
`;

export const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Inputs
export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  color: ${theme.colors.text};
  background: ${theme.colors.bgTertiary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  font-size: 16px;
  color: ${theme.colors.text};
  background: ${theme.colors.bgTertiary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238A8A8A' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;

  &:focus {
    border-color: ${theme.colors.accent};
  }
`;

// Buttons
export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost'; $size?: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  border: none;
  border-radius: ${theme.radii.md};
  cursor: pointer;
  transition: all 0.2s;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: 8px 12px;
          font-size: 13px;
        `;
      case 'lg':
        return css`
          padding: 16px 24px;
          font-size: 16px;
        `;
      default:
        return css`
          padding: 12px 20px;
          font-size: 14px;
        `;
    }
  }}

  ${({ $variant }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background: ${theme.colors.bgTertiary};
          color: ${theme.colors.text};
          &:hover {
            background: ${theme.colors.border};
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.textSecondary};
          &:hover {
            background: ${theme.colors.bgTertiary};
            color: ${theme.colors.text};
          }
        `;
      default:
        return css`
          background: ${theme.colors.accent};
          color: white;
          &:hover {
            background: ${theme.colors.accentHover};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Badge
export const Badge = styled.span<{ $variant?: 'success' | 'error' | 'warning' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: ${theme.radii.sm};

  ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return css`
          background: rgba(0, 210, 106, 0.1);
          color: ${theme.colors.success};
        `;
      case 'error':
        return css`
          background: rgba(255, 59, 59, 0.1);
          color: ${theme.colors.error};
        `;
      case 'warning':
        return css`
          background: rgba(255, 184, 0, 0.1);
          color: ${theme.colors.warning};
        `;
      default:
        return css`
          background: ${theme.colors.bgTertiary};
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

// Loading skeleton
export const Skeleton = styled.div<{ $width?: string; $height?: string }>`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '20px'};
  background: linear-gradient(
    90deg,
    ${theme.colors.bgTertiary} 25%,
    ${theme.colors.border} 50%,
    ${theme.colors.bgTertiary} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${theme.radii.sm};
`;

// Price display
export const PriceChange = styled.span<{ $positive: boolean }>`
  color: ${({ $positive }) => ($positive ? theme.colors.success : theme.colors.error)};
  font-weight: 600;
`;

// Live indicator
export const LiveIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${theme.colors.success};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${theme.colors.success};
    animation: ${pulse} 2s infinite;
  }
`;

// Tabs
export const TabList = styled.div`
  display: flex;
  gap: 4px;
  background: ${theme.colors.bgSecondary};
  padding: 4px;
  border-radius: ${theme.radii.md};
  margin-bottom: 24px;
  overflow-x: auto;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  min-width: 100px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? theme.colors.text : theme.colors.textSecondary)};
  background: ${({ $active }) => ($active ? theme.colors.bgTertiary : 'transparent')};
  border: none;
  border-radius: ${theme.radii.sm};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: ${theme.colors.text};
  }
`;
