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

const completedTravelSlice = createSlice({
    name: 'completedTravel',
    initialState,
    reducers: {
        addCompletedTravels: (state, action: PayloadAction<TravelState[]>) => {
            if (!action.payload) {
                return;
              }

              const newTravels = action.payload.filter(newTravel => 
                !state.travels.some(existingTravel => existingTravel.travelId === newTravel.travelId)
              );
              
              state.travels = [...state.travels, ...newTravels];
          },
        setCompletedTravels: (state, action: PayloadAction<TravelState[]>) => {
            state.travels = action.payload; // 기존 travels를 새로운 배열로 교체
        },
        removeCompletedTravelById: (state, action: PayloadAction<number>) => {
            state.travels = state.travels.filter(travel => travel.travelId !== action.payload);
        },
        
    },
});


export const selectCompletedTravelByTitleId = (state : RootState, titleId : number) : TravelState | undefined=> {
    return state.completedTravel.travels.find(travel => travel.travelId === titleId);
};


export const selectAllCompletedTravelIds = (state:RootState) : number[] => {
    return state.completedTravel.travels.map(travel => travel.travelId);
};
export const { addCompletedTravels, setCompletedTravels, removeCompletedTravelById } = completedTravelSlice.actions;
export default completedTravelSlice.reducer;
