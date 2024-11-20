import { createSlice } from '@reduxjs/toolkit';
import { getMatterNumber } from '../../utils';

const initialState = {
  contactInfo: {}, // Object: Stores claimant contact information
  matterUploadHistory: [], // Array: Stores the history of matter uploads
  matterInfo: {}, // Object: Stores matter information
  currentCampaign: "", //String: current campaign being viewed
  matterNumber: '', // String: matterInfo.name without "MAT-"
  isLockedOut: false, // Boolean: Tracks if user is locked out after too many failed login attempts
  documentUrl: '',
  alerts: [],
};

export const claimantSlice = createSlice({
  name: 'claimant',
  initialState,
  reducers: {
    setContactInfo: (state, action) => {
      state.contactInfo = action.payload;
    },
    setMatterInfo: (state, action) => {
      state.matterInfo = action.payload;
    },
    setCurrentCampaign: (state, action) => {
      state.currentCampaign = action.payload;
    },
    setMatterNumber: (state, action) => {
      state.matterNumber = getMatterNumber(action.payload);
    },
    setMatterUploadHistory: (state, action) => {
      state.matterUploadHistory = action.payload;
    },
    setLockedOut: (state, action) => {
      state.isLockedOut = action.payload;
    },
    setDocumentUrl: (state, action) => {
      state.documentUrl = action.payload;
    },
    setAlerts: (state, action) => {
      state.alerts = action.payload;
    },
  },
});

export const {
  setContactInfo,
  setMatterInfo,
  setMatterNumber,
  setCurrentCampaign,
  setMatterUploadHistory,
  setLockedOut,
  setDocumentUrl,
  setAlerts
} = claimantSlice.actions;

export default claimantSlice.reducer;
