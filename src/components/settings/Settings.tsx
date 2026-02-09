'use client';

import { User, Mail, Calendar, Globe, Bell, Shield, Sun, Moon, Palette } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/userSlice';
import { useTheme } from '@/context/ThemeContext';
import {
  Card,
  Flex,
  Text,
  Label,
  Select,
  Avatar,
  theme,
} from '@/components/ui/styled';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const SettingsSection = styled(Card)`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: color 0.3s;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${theme.colors.border};
  transition: border-color 0.3s;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${theme.colors.accent};
  }

  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.bgTertiary};
  transition: 0.3s;
  border-radius: 28px;

  &:before {
    position: absolute;
    content: '';
    height: 22px;
    width: 22px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${theme.colors.bgTertiary};
  border-radius: 12px;
  transition: background 0.3s;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${theme.colors.border};
  transition: border-color 0.3s;

  &:last-child {
    border-bottom: none;
  }

  svg {
    color: ${theme.colors.textSecondary};
    flex-shrink: 0;
    transition: color 0.3s;
  }
`;

const ThemeSwitcher = styled.div`
  display: flex;
  gap: 8px;
`;

const ThemeButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? 'white' : theme.colors.textSecondary)};
  background: ${({ $active }) => ($active ? theme.colors.accent : theme.colors.bgTertiary)};
  border: 1px solid ${({ $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? theme.colors.accentHover : theme.colors.border)};
    color: ${({ $active }) => ($active ? 'white' : theme.colors.text)};
  }

  svg {
    transition: transform 0.3s;
  }

  &:hover svg {
    transform: ${({ $active }) => ($active ? 'rotate(15deg)' : 'scale(1.1)')};
  }
`;

const currencies = [
  { code: 'EUR', name: 'Euro' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CHF', name: 'Swiss Franc' },
];

export function Settings() {
  const dispatch = useAppDispatch();
  const { user, settings } = useAppSelector((state) => state.user);
  const { mode, setTheme } = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCurrencyChange = (currency: string) => {
    dispatch(updateSettings({ defaultCurrency: currency }));
  };

  const handleNotificationsChange = (enabled: boolean) => {
    dispatch(updateSettings({ notifications: enabled }));
  };

  return (
    <SettingsContainer>
      <Text style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        Settings
      </Text>

      <SettingsSection $animate>
        <SectionTitle>
          <User size={20} />
          Profile
        </SectionTitle>

        <ProfileCard>
          <Avatar $size="lg">{getInitials(user.name)}</Avatar>
          <div>
            <Text style={{ fontSize: 18, fontWeight: 600 }}>{user.name}</Text>
            <Text $muted $size="14px">{user.email}</Text>
          </div>
        </ProfileCard>

        <div style={{ marginTop: 16 }}>
          <InfoItem>
            <Mail size={18} />
            <div>
              <Label>Email</Label>
              <Text>{user.email}</Text>
            </div>
          </InfoItem>

          <InfoItem>
            <Calendar size={18} />
            <div>
              <Label>Member Since</Label>
              <Text>{formatDate(user.memberSince)}</Text>
            </div>
          </InfoItem>

          <InfoItem>
            <Shield size={18} />
            <div>
              <Label>Account ID</Label>
              <Text style={{ fontFamily: theme.fonts.mono, fontSize: 13 }}>
                {user.id}
              </Text>
            </div>
          </InfoItem>
        </div>
      </SettingsSection>

      <SettingsSection $animate>
        <SectionTitle>
          <Palette size={20} />
          Appearance
        </SectionTitle>

        <SettingRow>
          <SettingLabel>
            <Text style={{ fontWeight: 500 }}>Theme</Text>
            <Text $muted $size="12px">Choose your preferred color scheme</Text>
          </SettingLabel>
          <ThemeSwitcher>
            <ThemeButton
              $active={mode === 'light'}
              onClick={() => setTheme('light')}
            >
              <Sun size={16} />
              Light
            </ThemeButton>
            <ThemeButton
              $active={mode === 'dark'}
              onClick={() => setTheme('dark')}
            >
              <Moon size={16} />
              Dark
            </ThemeButton>
          </ThemeSwitcher>
        </SettingRow>
      </SettingsSection>

      <SettingsSection $animate>
        <SectionTitle>
          <Globe size={20} />
          Preferences
        </SectionTitle>

        <SettingRow>
          <SettingLabel>
            <Text style={{ fontWeight: 500 }}>Default Currency</Text>
            <Text $muted $size="12px">Currency used for display and calculations</Text>
          </SettingLabel>
          <Select
            value={settings.defaultCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            style={{ width: 120 }}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </Select>
        </SettingRow>
      </SettingsSection>

      <SettingsSection $animate>
        <SectionTitle>
          <Bell size={20} />
          Notifications
        </SectionTitle>

        <SettingRow>
          <SettingLabel>
            <Text style={{ fontWeight: 500 }}>Push Notifications</Text>
            <Text $muted $size="12px">Receive alerts for price changes and spending</Text>
          </SettingLabel>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleNotificationsChange(e.target.checked)}
            />
            <ToggleSlider />
          </Toggle>
        </SettingRow>
      </SettingsSection>

      <Text $muted $size="12px" style={{ textAlign: 'center', marginTop: 24 }}>
        FinanceFlow v1.0.0
      </Text>
    </SettingsContainer>
  );
}
