import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TravelState {
    countryId : number;
    creatorId : number;
    days : number;
    id : number;
    image : string;
    memberCount : number;
    shareStatus : boolean;
    status : boolean;
    title : string;
    totalBudget : number;
    totalBudgetWon : number;
    shared : boolean;
}

interface TravelArrayState {
    travelData : TravelState[];
}

const initialState: TravelArrayState = {
    travelData : [],
};

const snsTravelSlice = createSlice({
    name: 'snsTravel',
    initialState,
    reducers: {
        setFeedTravels: (
            state,
            action: PayloadAction<TravelState[]>
        ) => {
            state.travelData = action.payload;
        },
        addFeedTravels: (state, action : PayloadAction<TravelState[]>) => {
            if (!action.payload) {
                return;
              }
            
            state.travelData = [...state.travelData, ...action.payload];
        },
    },
});

export const { setFeedTravels, addFeedTravels } = snsTravelSlice.actions;
export default snsTravelSlice.reducer;
