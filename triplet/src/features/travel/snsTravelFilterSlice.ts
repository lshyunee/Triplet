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
    page : 1,
    kind : 0
}

interface DetailFilter {
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
            state.memberCount = action.payload.memberCount;
            state.minBudget = action.payload.minBudget;
            state.maxBudget = action.payload.maxBudget;
            state.minDays = action.payload.minDays;
            state.maxDays = action.payload.maxDays;
        },
        addFilter: (state, action : PayloadAction<number>) => {
            state.kind = action.payload;
        },
        setPages :  (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setCountry : (state, action: PayloadAction<string>) => {
            state.countryName = action.payload;
        },
        initFilter : (state) => {
            return initialState;
        }
    }
})

export const { setFilter, addFilter, setPages, setCountry, initFilter } = snsTravelFilterSlice.actions;
export default snsTravelFilterSlice.reducer;