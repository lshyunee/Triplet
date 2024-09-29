import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TravelState {
    countryName : string;
    memberCount : number;
    minBudget : number;
    maxBudget : number;
    month : number;
    minDays : number;
    maxDays : number;
    page : number;
    kind : string;
}

interface TravelCacheState {
    data: TravelState[];
    currentPage: number;
    totalPages: number;
}

interface FilterCache {
    [key: string]: TravelCacheState; // 각 필터에 대해 캐시 저장
}

interface TravelArrayState {
    travelCache: FilterCache;
}

const initialState: TravelArrayState = {
    travelCache: {},
};

const snsTravelSlice = createSlice({
    name: 'snsTravel',
    initialState,
    reducers: {
        // 캐시 업데이트: 필터와 페이지에 맞는 데이터를 저장
        setCachedTravels: (
            state,
            action: PayloadAction<{ filter: string; page: number; data: TravelState[]; totalPages: number }>
        ) => {
            const { filter, page, data, totalPages } = action.payload;
            if (!state.travelCache[filter]) {
                state.travelCache[filter] = { data: [], currentPage: 0, totalPages: 0 };
            }

            // 기존 캐시된 데이터에 새 페이지 데이터를 추가
            state.travelCache[filter].data = [...state.travelCache[filter].data, ...data];
            state.travelCache[filter].currentPage = page;
            state.travelCache[filter].totalPages = totalPages;
        },
    },
});

export const { setCachedTravels } = snsTravelSlice.actions;
export default snsTravelSlice.reducer;
