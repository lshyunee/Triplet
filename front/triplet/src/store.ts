import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice, { logout } from './features/auth/authSlice';
import naviSlice from './features/navigation/naviSlice';
import ongoingTravelSlice from './features/travel/ongoingTravelSlice';
import upcomingTravelSlice from './features/travel/upcomingTravelSlice';
import completedTravelSlice from './features/travel/completedTravelSlice';
import snsTravelSlice from './features/travel/snsTravelSlice';
import sharedTravelSlice from './features/travel/shareTravelSlice';
import userInfoSlice from './features/user/userInfoSlice';
import snsTravelFilterSlice from './features/travel/snsTravelFilterSlice';

const appReducer = combineReducers({
  auth: authSlice,
  navi: naviSlice,
  ongoingTravel: ongoingTravelSlice,
  upcomingTravel: upcomingTravelSlice,
  completedTravel: completedTravelSlice,
  snsTravel: snsTravelSlice,
  userInfo: userInfoSlice,
  sharedTravel: sharedTravelSlice,
  filterTravel: snsTravelFilterSlice,
});

const rootReducer = (state:any, action: any) => {
  if(action.type === logout.type){
    state = undefined;
  }
  return appReducer(state, action);
}

const persistedState = localStorage.getItem('isAuthenticated') === 'true'
  ? { auth: { isAuthenticated: true } }
  : { auth: { isAuthenticated: false } };

  

// 스토어 생성
const store = configureStore({
  reducer : rootReducer,
  preloadedState : persistedState,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;