// Redux slice with a caching-friendly initial state
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  envelopes: {}, // Each key here will be an envelopeId with its details as the value
  isLoading: false,
  error: null,
};

const envelopesSlice = createSlice({
  name: 'envelopes',
  initialState,
  reducers: {
    cacheEnvelope: (state, action) => {
      const { id, details } = action.payload;
      state.envelopes[id] = details;  // Cache the envelope details by id
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { cacheEnvelope, setLoading, setError } = envelopesSlice.actions;
export default envelopesSlice.reducer;
