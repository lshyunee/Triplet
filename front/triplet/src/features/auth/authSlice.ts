// features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state) {
      state.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem('isAuthenticated'); 
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
