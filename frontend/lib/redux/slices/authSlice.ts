import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

const token = Cookies.get('token');

const initialState: AuthState = {
  user: null,
  token: token || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      Cookies.set('token', action.payload.token, { expires: 7 });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    }
  },
});

export const { setAuth, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
