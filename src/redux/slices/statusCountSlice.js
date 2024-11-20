import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    completed: 0,
    delivered: 0,
    finishLater: 0,
    declined: 0,
    authFailure: 0,
};

const statusCountSlice = createSlice({
    name: 'statusCounts',
    initialState,
    reducers: {
        setCounts: (state, action) => {
            state.completed = action.payload.completed;
            state.delivered = action.payload.delivered;
            state.finishLater = action.payload.finishLater;
            state.declined = action.payload.declined;
            state.authFailure = action.payload.authFailure;
        },
    },
});

export const { setCounts } = statusCountSlice.actions;
export default statusCountSlice.reducer;