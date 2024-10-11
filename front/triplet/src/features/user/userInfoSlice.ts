import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface userState {
    memberId : String,
    name : String,
    birth : String,
    gender : String,
    phoneNumber : String,
}

const initialState: userState = {
    memberId : '',
    name : '',
    birth : '',
    gender : '',
    phoneNumber : '',
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo(state, actions: PayloadAction<Partial<userState>>) {
            const {
                memberId,
                name,
                birth,
                gender,
                phoneNumber,
            } = actions.payload;

            if (memberId !== undefined) state.memberId = memberId;
            if (name !== undefined) state.name = name;
            if (birth !== undefined) state.birth = birth;
            if (gender !== undefined) state.gender = gender;
            if (phoneNumber !== undefined) state.phoneNumber = phoneNumber;
        },
        resetInfo(){
            return initialState;
        }
    },
});

export const { setUserInfo, resetInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;