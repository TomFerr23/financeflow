'use client';

import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  Wallet,
  Settings as SettingsIcon,
  X,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { PageId, NavItem } from '@/types';
import styled from 'styled-components';
import {
  SidebarContainer,
  SidebarHeader,
  SidebarNav,
  SidebarItem,
  SidebarFooter,
  Avatar,
  Flex,
  Text,
  Label,
  theme,
  HamburgerButton,
} from '@/components/ui/styled';

const CloseButton = styled(HamburgerButton)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'currency', label: 'Currency', Icon: ArrowLeftRight },
  { id: 'stocks', label: 'Watchlist', Icon: TrendingUp },
  { id: 'expenses', label: 'Expenses', Icon: Wallet },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
];

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activePage, onNavigate, isOpen, onClose }: SidebarProps) {
  const { user, balance } = useAppSelector((state) => state.user);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatBalance = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const handleNavClick = (pageId: PageId) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarHeader>
        <Flex $justify="space-between" $align="center">
          <Text style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>
            FinanceFlow
          </Text>
          <CloseButton onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </CloseButton>
        </Flex>
      </SidebarHeader>

      <SidebarNav>
        {navItems.map((item) => (
          <SidebarItem
            key={item.id}
            $active={activePage === item.id}
            onClick={() => handleNavClick(item.id)}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <item.Icon size={20} />
            {item.label}
          </SidebarItem>
        ))}
      </SidebarNav>

      <SidebarFooter>
        <Flex $gap="12px" $align="center" style={{ marginBottom: 12 }}>
          <Avatar $size="md">{getInitials(user.name)}</Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontWeight: 600, marginBottom: 2 }}>{user.name}</Text>
            <Text $muted $size="12px" style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.email}
            </Text>
          </div>
        </Flex>
        <div style={{
          padding: '12px',
          background: theme.colors.bgTertiary,
          borderRadius: theme.radii.md
        }}>
          <Label>Balance</Label>
          <Text style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
            {formatBalance(balance.total, balance.currency)}
          </Text>
          <Text $muted $size="11px" style={{ marginTop: 4 }}>
            Member since {formatDate(user.memberSince)}
          </Text>
        </div>
      </SidebarFooter>

    </SidebarContainer>
  );
}
