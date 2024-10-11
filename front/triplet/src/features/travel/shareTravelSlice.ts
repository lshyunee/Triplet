import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Budget {
  categoryId: number;
  categoryName: string;
  budget: number;
  budgetWon: number;
}

interface SharedTravelState {
  travelId: number;
  inviteCode: string;
  country: string;
  countryId: number;
  currency: string;
  startDate: string;
  endDate: string;
  title: string;
  image: string;
  creatorId: number;
  myTravel: boolean;
  memberCount: number;
  totalBudget: number;
  airportCost: number;
  totalBudgetWon: number;
  status: boolean;
  shareStatus: boolean;
  budgets: Budget[];
  shared: boolean;
}

const initialState: SharedTravelState = {
  travelId: 0,
  inviteCode: '',
  country: '',
  countryId: 0,
  currency: '',
  startDate: '',
  endDate: '',
  title: '',
  image: '',
  creatorId: 0,
  myTravel: false,
  memberCount: 0,
  totalBudget: 0,
  airportCost: 0,
  totalBudgetWon: 0,
  status: false,
  shareStatus: false,
  budgets: [],
  shared: false,
};

const sharedTravelSlice = createSlice({
  name: 'sharedTravel',
  initialState,
  reducers: {
    sharedTravelDataInsert(state, action: PayloadAction<Partial<SharedTravelState>>) {
      const {
        travelId,
        inviteCode,
        country,
        countryId,
        currency,
        startDate,
        endDate,
        title,
        image,
        creatorId,
        myTravel,
        memberCount,
        totalBudget,
        airportCost,
        totalBudgetWon,
        status,
        shareStatus,
        budgets,
        shared,
      } = action.payload;

      if (travelId !== undefined) state.travelId = travelId;
      if (inviteCode !== undefined) state.inviteCode = inviteCode;
      if (country !== undefined) state.country = country;
      if (countryId !== undefined) state.countryId = countryId;
      if (currency !== undefined) state.currency = currency;
      if (startDate !== undefined) state.startDate = startDate;
      if (endDate !== undefined) state.endDate = endDate;
      if (title !== undefined) state.title = title;
      if (image !== undefined) state.image = image;
      if (creatorId !== undefined) state.creatorId = creatorId;
      if (myTravel !== undefined) state.myTravel = myTravel;
      if (memberCount !== undefined) state.memberCount = memberCount;
      if (totalBudget !== undefined) state.totalBudget = totalBudget;
      if (airportCost !== undefined) state.airportCost = airportCost;
      if (totalBudgetWon !== undefined) state.totalBudgetWon = totalBudgetWon;
      if (status !== undefined) state.status = status;
      if (shareStatus !== undefined) state.shareStatus = shareStatus;
      if (budgets !== undefined) state.budgets = budgets;
      if (shared !== undefined) state.shared = shared;
    },
  },
});

export const { sharedTravelDataInsert } = sharedTravelSlice.actions;
export default sharedTravelSlice.reducer;
