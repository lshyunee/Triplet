import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface TravelState {
  travelId: number;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  countryName: string;
  countryId: number;
  currency: string;
  memberCount: number;
  totalBudget: number;
  usedBudget: number;
  status: boolean;
  shareStatus: boolean;
  shared: boolean;
  airportCost : number;
  creatorId : number;
}

const initialState: TravelState = {
  travelId: 0,
  title: "",
  startDate: "",
  endDate: "",
  image: "",
  countryName: "",
  countryId: 0,
  currency: "",
  memberCount: 0,
  totalBudget: 0,
  usedBudget: 0,
  status: false,
  shareStatus: false,
  shared: false,
  airportCost: 0,
  creatorId : 0,
};

const ongoingTravelSlice = createSlice({
  name: "ongoingTravel",
  initialState,
  reducers: {
    ongoingTravelDataInsert(state, action: PayloadAction<Partial<TravelState>>) {
      const {
        travelId,
        title,
        startDate,
        endDate,
        image,
        countryName,
        countryId,
        currency,
        memberCount,
        totalBudget,
        usedBudget,
        status,
        shareStatus,
        shared,
        airportCost,
        creatorId,
      } = action.payload;

      if (travelId !== undefined) state.travelId = travelId;
      if (title !== undefined) state.title = title;
      if (startDate !== undefined) state.startDate = startDate;
      if (endDate !== undefined) state.endDate = endDate;
      if (image !== undefined) state.image = image;
      if (countryName !== undefined) state.countryName = countryName;
      if (countryId !== undefined) state.countryId = countryId;
      if (currency !== undefined) state.currency = currency;
      if (memberCount !== undefined) state.memberCount = memberCount;
      if (totalBudget !== undefined) state.totalBudget = totalBudget;
      if (usedBudget !== undefined) state.usedBudget = usedBudget;
      if (status !== undefined) state.status = status;
      if (shareStatus !== undefined) state.shareStatus = shareStatus;
      if (shared !== undefined) state.shared = shared;
      if (airportCost !== undefined) state.airportCost = airportCost;
      if (creatorId !== undefined) state.creatorId = creatorId;
    },
    removeOngoingTravel(state, action: PayloadAction<number>) {
      if (state.travelId === action.payload) {
        // 상태를 초기 상태로 되돌림
        Object.assign(state, initialState);
      }
    },
  },
});


export const selectOngoingTravelId = (state:RootState) : number => {
  return state.ongoingTravel.travelId;
};

export const { ongoingTravelDataInsert, removeOngoingTravel } = ongoingTravelSlice.actions;
export default ongoingTravelSlice.reducer;
