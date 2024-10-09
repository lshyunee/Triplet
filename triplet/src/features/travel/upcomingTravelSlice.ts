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
}

interface TravelArrayState {
    travels: TravelState[];
}

const initialState: TravelArrayState = {
    travels: [],
};

const upcomingTravelSlice = createSlice({
    name: 'upcomingTravels',
    initialState,
    reducers: {
        addUpcomingTravels: (state, action: PayloadAction<TravelState[]>) => {
            if (!action.payload) {
                return;
              }
              
            const newTravels = action.payload.filter(newTravel => 
              !state.travels.some(existingTravel => existingTravel.travelId === newTravel.travelId)
            );
            
            state.travels = [...state.travels, ...newTravels];
          },
        setUpcomingTravels: (state, action: PayloadAction<TravelState[]>) => {
            state.travels = action.payload; // 기존 travels를 새로운 배열로 교체
        },
    },
});

export const selectUpcomingTravelByTitleId = (state : RootState, travelId : number) : TravelState | undefined => {
    return state.upcomingTravel.travels.find(travel => travel.travelId === travelId);
};

export const selectAllUpcomingTravelIds = (state:RootState) : number[] => {
    return state.upcomingTravel.travels.map(travel => travel.travelId);
};
export const { addUpcomingTravels, setUpcomingTravels } = upcomingTravelSlice.actions;
export default upcomingTravelSlice.reducer;
