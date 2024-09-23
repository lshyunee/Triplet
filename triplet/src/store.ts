import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';
import titleSlice from './features/header/titleSlice';

// 스토어 생성
const store = configureStore({
  reducer: {
    auth: authSlice,
    title: titleSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
