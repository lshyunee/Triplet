import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';

// 스토어 생성
const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
