import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isVerified: false, // Boolean: Tracks if user credentials are correct
};

export const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    setVerified: (state, action) => {
        state.isVerified = action.payload;
    },
  },
});

export const { setVerified } = sharedSlice.actions;

export default sharedSlice.reducer;
