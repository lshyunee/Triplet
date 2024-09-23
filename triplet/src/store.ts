import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';
import naviSlice from './features/navigation/naviSlice';

// 스토어 생성
const store = configureStore({
  reducer: {
    auth: authSlice,
    navi: naviSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
