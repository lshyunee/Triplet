import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface TravelState {
  travelId: number;
}

const initialState: TravelState = {
  travelId: 0,
};

const deleteTravelSlice = createSlice({
  name: "deleteTravel",
  initialState,
  reducers: {
    deleteTravel(state, action: PayloadAction<number>) {
        state.travelId = action.payload;
    },
    initialDeleteTravel : (state) => {
        state.travelId = 0;
    }
  },
});

export const { deleteTravel, initialDeleteTravel } = deleteTravelSlice.actions;
export default deleteTravelSlice.reducer;
