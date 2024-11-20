import { configureStore } from '@reduxjs/toolkit';
import claimantReducer from './slices/claimantSlice';
import adminReducer from './slices/adminSlice';
import sharedReducer from './slices/sharedSlice';
import envelopesReducer from './slices/envelopesSlice';
import statusCountReducer from './slices/statusCountSlice'

export const store = configureStore({
  reducer: {
    envelopes: envelopesReducer,
    claimant: claimantReducer,
    statusCount: statusCountReducer,
    admin: adminReducer,
    shared: sharedReducer,
  },
});