import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserBalance, UserSettings } from '@/types';

interface UserState {
  user: User;
  balance: UserBalance;
  settings: UserSettings;
}

// Demo user data
const initialState: UserState = {
  user: {
    id: 'usr_001',
    name: 'Tom Ferrari',
    email: 'tomferrari.dev@gmail.com',
    memberSince: '2024-01-15',
  },
  balance: {
    total: 12450.0,
    currency: 'EUR',
  },
  settings: {
    defaultCurrency: 'EUR',
    notifications: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateBalance: (state, action: PayloadAction<Partial<UserBalance>>) => {
      state.balance = { ...state.balance, ...action.payload };
    },
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { updateBalance, updateSettings, updateProfile } = userSlice.actions;
export default userSlice.reducer;
