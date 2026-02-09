'use client';

import styled, { css, keyframes } from 'styled-components';

// Theme colors using CSS variables for dynamic theming
export const theme = {
  colors: {
    bg: 'var(--color-bg)',
    bgSecondary: 'var(--color-bg-secondary)',
    bgTertiary: 'var(--color-bg-tertiary)',
    text: 'var(--color-text)',
    textSecondary: 'var(--color-text-secondary)',
    textMuted: 'var(--color-text-muted)',
    accent: 'var(--color-accent)',
    accentHover: 'var(--color-accent-hover)',
    accentLight: 'var(--color-accent-light)',
    success: 'var(--color-success)',
    successLight: 'var(--color-success-light)',
    error: 'var(--color-error)',
    errorLight: 'var(--color-error-light)',
    warning: 'var(--color-warning)',
    warningLight: 'var(--color-warning-light)',
    border: 'var(--color-border)',
    cardShadow: 'var(--color-card-shadow)',
    gradientPrimary: 'var(--gradient-primary)',
    gradientSecondary: 'var(--gradient-secondary)',
    gradientSuccess: 'var(--gradient-success)',
    gradientAccent: 'var(--gradient-accent)',
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

// CSS Variables for theming
export const ThemeVariables = styled.div`
  /* Dark theme (default) */
  --color-bg: #0D0D0D;
  --color-bg-secondary: #1A1A1A;
  --color-bg-tertiary: #252525;
  --color-text: #FFFFFF;
  --color-text-secondary: #8A8A8A;
  --color-text-muted: #5A5A5A;
  --color-accent: #0066FF;
  --color-accent-hover: #0052CC;
  --color-accent-light: rgba(0, 102, 255, 0.1);
  --color-success: #00D26A;
  --color-success-light: rgba(0, 210, 106, 0.1);
  --color-error: #FF3B3B;
  --color-error-light: rgba(255, 59, 59, 0.1);
  --color-warning: #FFB800;
  --color-warning-light: rgba(255, 184, 0, 0.1);
  --color-border: #2A2A2A;
  --color-card-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  --gradient-primary: linear-gradient(135deg, #0066FF 0%, #00D26A 100%);
  --gradient-secondary: linear-gradient(135deg, #FF3B3B 0%, #FFB800 100%);
  --gradient-success: linear-gradient(135deg, #00D26A 0%, #00FFB2 100%);
  --gradient-accent: linear-gradient(135deg, #0066FF 0%, #8B5CF6 100%);

  /* Light theme */
  &[data-theme="light"] {
    --color-bg: #F5F7FA;
    --color-bg-secondary: #FFFFFF;
    --color-bg-tertiary: #EDF2F7;
    --color-text: #1A202C;
    --color-text-secondary: #4A5568;
    --color-text-muted: #A0AEC0;
    --color-accent: #0066FF;
    --color-accent-hover: #0052CC;
    --color-accent-light: rgba(0, 102, 255, 0.08);
    --color-success: #00B85E;
    --color-success-light: rgba(0, 184, 94, 0.1);
    --color-error: #E53E3E;
    --color-error-light: rgba(229, 62, 62, 0.1);
    --color-warning: #DD6B20;
    --color-warning-light: rgba(221, 107, 32, 0.1);
    --color-border: #E2E8F0;
    --color-card-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    --gradient-primary: linear-gradient(135deg, #0066FF 0%, #00B85E 100%);
    --gradient-secondary: linear-gradient(135deg, #E53E3E 0%, #DD6B20 100%);
    --gradient-success: linear-gradient(135deg, #00B85E 0%, #38D9A9 100%);
    --gradient-accent: linear-gradient(135deg, #0066FF 0%, #805AD5 100%);
  }

  transition: all 0.3s ease;
`;

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

const chartGrow = keyframes`
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
`;

const chartSlideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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
  box-shadow: ${theme.colors.cardShadow};
  animation: ${({ $animate }) => ($animate ? css`${fadeIn} 0.3s ease-out` : 'none')};
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;

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
  transition: color 0.3s;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
  transition: color 0.3s;
`;

export const Text = styled.p<{ $muted?: boolean; $size?: string }>`
  font-size: ${({ $size }) => $size || '14px'};
  color: ${({ $muted }) => ($muted ? theme.colors.textSecondary : theme.colors.text)};
  margin: 0;
  line-height: 1.5;
  transition: color 0.3s;
`;

export const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.3s;
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
  transition: border-color 0.2s, box-shadow 0.2s, background 0.3s, color 0.3s;

  &:focus {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px ${theme.colors.accentLight};
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
  transition: background 0.3s, border-color 0.3s, color 0.3s;

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
  transition: background 0.3s, color 0.3s;

  ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return css`
          background: ${theme.colors.successLight};
          color: ${theme.colors.success};
        `;
      case 'error':
        return css`
          background: ${theme.colors.errorLight};
          color: ${theme.colors.error};
        `;
      case 'warning':
        return css`
          background: ${theme.colors.warningLight};
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
  transition: color 0.3s;
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
  transition: background 0.3s;

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

// Filter Tabs (pill style)
export const FilterTabList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterTab = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? 'white' : theme.colors.textSecondary)};
  background: ${({ $active }) => ($active ? theme.colors.accent : theme.colors.bgTertiary)};
  border: none;
  border-radius: ${theme.radii.full};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? theme.colors.accentHover : theme.colors.border)};
    color: ${({ $active }) => ($active ? 'white' : theme.colors.text)};
  }
`;

// Sidebar Components
export const SidebarContainer = styled.aside<{ $isOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: ${theme.colors.bgSecondary};
  border-right: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: background 0.3s, border-color 0.3s;

  @media (max-width: 768px) {
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s ease-out, background 0.3s, border-color 0.3s;
  }
`;

export const SidebarHeader = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid ${theme.colors.border};
  transition: border-color 0.3s;
`;

export const SidebarNav = styled.nav`
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
`;

export const SidebarItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? theme.colors.text : theme.colors.textSecondary)};
  background: ${({ $active }) => ($active ? theme.colors.bgTertiary : 'transparent')};
  border: none;
  border-radius: ${theme.radii.md};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: ${theme.colors.bgTertiary};
    color: ${theme.colors.text};
  }

  svg {
    flex-shrink: 0;
  }
`;

export const SidebarFooter = styled.div`
  padding: 16px;
  border-top: 1px solid ${theme.colors.border};
  transition: border-color 0.3s;
`;

export const Avatar = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radii.md};
  background: ${theme.colors.gradientAccent};
  color: white;
  font-weight: 600;
  flex-shrink: 0;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          width: 32px;
          height: 32px;
          font-size: 12px;
        `;
      case 'lg':
        return css`
          width: 56px;
          height: 56px;
          font-size: 20px;
        `;
      default:
        return css`
          width: 40px;
          height: 40px;
          font-size: 14px;
        `;
    }
  }}
`;

export const MobileHeader = styled.header`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${theme.colors.bgSecondary};
  border-bottom: 1px solid ${theme.colors.border};
  padding: 0 16px;
  z-index: 99;
  transition: background 0.3s, border-color 0.3s;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: ${theme.colors.text};
  cursor: pointer;
  border-radius: ${theme.radii.sm};
  transition: background 0.2s, color 0.3s;

  &:hover {
    background: ${theme.colors.bgTertiary};
  }
`;

export const Overlay = styled.div<{ $isOpen?: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`;

export const MainContent = styled.main`
  margin-left: 260px;
  min-height: 100vh;
  padding: 24px;
  background: ${theme.colors.bg};
  transition: background 0.3s;

  @media (max-width: 768px) {
    margin-left: 0;
    padding-top: 76px;
    padding-left: 16px;
    padding-right: 16px;
  }
`;

// Summary Card for Dashboard Overview
export const SummaryCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SummaryValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text};
  font-variant-numeric: tabular-nums;
  transition: color 0.3s;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const SummaryLabel = styled.span`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  transition: color 0.3s;
`;

export const SummaryIcon = styled.div<{ $color?: string }>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radii.md};
  background: ${({ $color }) => $color ? `${$color}15` : theme.colors.bgTertiary};
  color: ${({ $color }) => $color || theme.colors.accent};
  transition: background 0.3s;
`;

// Chart Components
export const ChartCard = styled(Card)`
  position: relative;
  overflow: hidden;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ChartContainer = styled.div<{ $animate?: boolean }>`
  width: 100%;
  height: 300px;
  animation: ${({ $animate }) => ($animate ? css`${chartSlideIn} 0.6s ease-out` : 'none')};

  @media (max-width: 768px) {
    height: 250px;
  }

  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: ${theme.colors.border};
  }

  .recharts-text {
    fill: ${theme.colors.textSecondary};
  }

  .recharts-tooltip-wrapper {
    outline: none;
  }
`;

export const ChartTooltip = styled.div`
  background: ${theme.colors.bgSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  padding: 12px 16px;
  box-shadow: ${theme.colors.cardShadow};
`;

export const ChartLegend = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`;

export const LegendDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

// Gradient bar for charts
export const GradientBar = styled.div<{ $width: number; $delay?: number }>`
  height: 8px;
  border-radius: ${theme.radii.full};
  background: ${theme.colors.gradientPrimary};
  width: ${({ $width }) => $width}%;
  transform-origin: left;
  animation: ${chartGrow} 0.8s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay || 0}s;
`;

// Progress Ring
export const ProgressRing = styled.div<{ $progress: number; $color?: string }>`
  position: relative;
  width: 120px;
  height: 120px;

  svg {
    transform: rotate(-90deg);

    circle {
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;

      &:first-child {
        stroke: ${theme.colors.bgTertiary};
      }

      &:last-child {
        stroke: ${({ $color }) => $color || theme.colors.accent};
        stroke-dasharray: 314;
        stroke-dashoffset: ${({ $progress }) => 314 - (314 * $progress) / 100};
        transition: stroke-dashoffset 1s ease-out;
      }
    }
  }
`;

// Theme Toggle Button
export const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${theme.colors.bgTertiary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  color: ${theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.border};
    transform: scale(1.05);
  }

  svg {
    transition: transform 0.3s;
  }

  &:active svg {
    transform: rotate(180deg);
  }
`;
