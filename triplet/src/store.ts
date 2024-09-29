import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';
import naviSlice from './features/navigation/naviSlice';
import ongoingTravelSlice from './features/travel/ongoingTravelSlice';
import upcomingTravelSlice from './features/travel/upcomingTravelSlice';
import completedTravelSlice from './features/travel/completedTravelSlice';
import snsTravelSlice from './features/travel/snsTravelSlice';

// 스토어 생성
const store = configureStore({
  reducer: {
    auth: authSlice,
    navi: naviSlice,
    ongoingTravel: ongoingTravelSlice,
    upcomingTravel : upcomingTravelSlice,
    completedTravel : completedTravelSlice,
    snsTravel : snsTravelSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
