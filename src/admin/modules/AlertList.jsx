import React, { useEffect, useState } from "react";
import AlertCard from "./AlertCard";
import { useSelector, useDispatch } from 'react-redux';
import { setAlerts, setCampaigns, setAlertsHaveBeenUpdated } from "../../redux/slices/adminSlice";
import { Box, Stack, TextField, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from "@mui/material";
import { fetchCampaigns, fetchDocumentAlerts } from "../../api/adminApiCalls"; // Assuming there's a call for admin emails
import { emailWhitelist } from "../../utils";

const AlertList = ({ onSelectAlert, selectedAlert }) => {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.admin.alerts);
  const campaigns = useSelector((state) => state.admin.campaigns);
  // const user = useSelector((state) => state.admin.user);
  // const [createdBy, setCreatedBy] = useState(user || "");
  const [createdBy, setCreatedBy] = useState("All");
  const alertsHaveBeenUpdated = useSelector((state) => state.admin.alertsHaveBeenUpdated);
  const [campaignFilter, setCampaignFilter] = useState('');
  const [isSortNewestFirst, setIsSortNewestFirst] = useState(true); // New state for toggling newest to oldest
  const [filteredAlerts, setFilteredAlerts] = useState(null);

  // Fetch campaigns, alerts, and admin emails when the component mounts
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const campaignsResponse = await fetchCampaigns();
        const alertsResponse = await fetchDocumentAlerts();
        console.log(alertsResponse)
        dispatch(setCampaigns(campaignsResponse));
        dispatch(setAlerts(alertsResponse));
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        // Reset the alertsUpdated flag only if it was true
        if (alertsHaveBeenUpdated) {
          setAlertsHaveBeenUpdated(false);
        }
      }
    };
    fetchAdminData();
  }, [alertsHaveBeenUpdated, dispatch]);

  useEffect(() => {
    console.log(alerts)
    const filterAndSortAlerts = () => {
      if (!alerts) return; // Ensure alerts are available

      let filtered = [...alerts];

      // Filter by Created By (handle undefined values)
      if (createdBy && createdBy !== "All") {
        filtered = filtered.filter((alert) =>
          alert.created_by?.toLowerCase().includes(createdBy.toLowerCase())
        );
      }

      // Filter by Campaign
      if (campaignFilter) {
        filtered = filtered.filter((alert) =>
          alert.campaign?.toLowerCase().includes(campaignFilter.toLowerCase())
        );
      }

      // Sort by Date (newest to oldest or oldest to newest)
      filtered.sort((a, b) => {
        const dateA = new Date(a.insert_date); // Parsing insert_date
        const dateB = new Date(b.insert_date);
        return isSortNewestFirst ? dateB - dateA : dateA - dateB;
      });

      setFilteredAlerts(filtered);
    };

    filterAndSortAlerts();
  }, [createdBy, campaignFilter, alerts, isSortNewestFirst, campaigns]);

  const handleToggleRead = (campaign) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.campaign === campaign ? { ...alert, admin_read: !alert.admin_read } : alert
    );
    dispatch(setAlerts(updatedAlerts));
  };

  return (
    <Box sx={{display: "flex", height: "100vh", flexDirection: "column"}}>
      {/* Filter section with Stack for layout */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        {/* Toggle Sort by Newest/Oldest */}
        <FormControlLabel
          control={
            <Switch
              checked={isSortNewestFirst}
              onChange={() => setIsSortNewestFirst(!isSortNewestFirst)}
              color="primary"
              size="small"
            />
          }
          label={isSortNewestFirst ? "Newest" : "Oldest"}
        />

        {/* Filter by Created By (Dropdown) */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="created-by-label">Created By</InputLabel>
          <Select
            labelId="created-by-label"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            label="Created By"
          >
            {emailWhitelist.map((email) => (
            <MenuItem key={email} value={email}>
              {email}
            </MenuItem>
          ))}
          </Select>
        </FormControl>

        {/* Filter by Campaign (Search bar with auto-filter) */}
        <TextField
          label="Campaign"
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
          fullWidth
        />
      </Stack>
      <Box sx={{height: "100vh", overflowY: "auto"}}>
        {/* Display Filtered and Sorted Alerts */}
        {filteredAlerts && filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, i) => (
            <AlertCard
              key={i}
              alert={alert}
              onSelectAlert={onSelectAlert}
              selectedAlert={selectedAlert}
              onToggleRead={handleToggleRead}
            />
          ))
        ) : (
          <p>No alerts found matching the filters.</p>
        )}
      </Box>
    </Box>
  );
};

export default AlertList;
