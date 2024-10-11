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
        addFeedTravels: (state, action: PayloadAction<TravelState[]>) => {
            if (!action.payload) {
                return;
            }
            
            const newData = action.payload.filter(
                newTravel => !state.travelData.some(existingTravel => existingTravel.id === newTravel.id)
            );

            state.travelData = [...state.travelData, ...newData];
        },
        initFeedTravels: (state) => {
            state.travelData = []; 
        }
    },
});

export const { setFeedTravels, addFeedTravels, initFeedTravels } = snsTravelSlice.actions;
export default snsTravelSlice.reducer;
