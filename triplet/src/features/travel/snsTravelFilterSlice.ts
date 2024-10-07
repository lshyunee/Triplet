import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
    countryName : string,
    memberCount : number,
    minBudget : number,
    maxBudget : number,
    minDays : number,
    maxDays : number,
    page : number,
    kind : number
}

const initialState : FilterState = {
    countryName : '',
    memberCount : 0,
    minBudget : 0,
    maxBudget : 0,
    minDays : 0,
    maxDays : 0,
    page : 0,
    kind : 0
}

interface DetailFilter {
    countryName : string,
    memberCount : number,
    minBudget : number,
    maxBudget : number,
    minDays : number,
    maxDays : number,
}

const snsTravelFilterSlice = createSlice({
    name : 'snsTravelFilter',
    initialState,
    reducers : {
        setFilter : (state, action : PayloadAction<DetailFilter>) => {
            state.countryName = action.payload.countryName;
            state.memberCount = action.payload.memberCount;
            state.minBudget = action.payload.minBudget;
            state.maxBudget = action.payload.maxBudget;
            state.minDays = action.payload.minDays;
            state.maxDays = action.payload.maxDays;
        },
        addFilter: (state, action : PayloadAction<FilterState>) => {
            state.kind = action.payload.kind;
        },
        setPages :  (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        }
    }
})

export const { setFilter, addFilter, setPages } = snsTravelFilterSlice.actions;
export default snsTravelFilterSlice.reducer;