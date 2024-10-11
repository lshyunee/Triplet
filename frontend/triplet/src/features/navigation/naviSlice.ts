import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NaviState {
    currentPage: string;
}

const initialState: NaviState = {
    currentPage: 'home',
};

const naviSlice = createSlice({
    name: 'navi',
    initialState,
    reducers: {
        pageMove(state, actions) {
            state.currentPage = actions.payload;
        },
    }
});

export const { pageMove } = naviSlice.actions;
export default naviSlice.reducer;