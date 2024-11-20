import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAdmin: false, // Boolean: Determines if admin login screen is shown
  alerts: [],
  alertsHaveBeenUpdated: false,
  campaigns: [],
  claimantUploadsByCampaign: [],
  user: "",
  // user: "cbandstra@wagstafflawfirm.com", //String: Admin email
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    setAlerts: (state, action) => {
      state.alerts = action.payload;
    },
    setAlertsHaveBeenUpdated: (state, action) => {
      state.alertsHaveBeenUpdated = action.payload;
    },
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setClaimantUploadsByCampaign: (state, action) => {
      state.claimantUploadsByCampaign = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setAdmin, setAlerts, setAlertsHaveBeenUpdated, setCampaigns, setClaimantUploadsByCampaign, setUser } = adminSlice.actions;

export default adminSlice.reducer;
