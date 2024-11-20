import React, { useEffect, useState } from "react";
import ClaimantAlertCard from "./ClaimantAlertCard";
import { useSelector, useDispatch } from 'react-redux';
import { setAlerts } from "../../redux/slices/adminSlice";
import { Box, Stack, Switch, FormControlLabel } from "@mui/material";
import { fetchDocumentAlertsByMatter } from "../../api/claimantApiCalls";
import { setAlerts as setClaimantAlerts } from "../../redux/slices/claimantSlice";

const ClaimantAlertList = ({ onSelectAlert, selectedAlert }) => {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.claimant.alerts);
  const matterInfo = useSelector((state) => state.claimant.matterInfo);
  const [isSortNewestFirst, setIsSortNewestFirst] = useState(true); // New state for toggling newest to oldest
  const [filteredAlerts, setFilteredAlerts] = useState(alerts);

  // Fetch campaigns, alerts, and admin emails when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentAlertsByMatter = await fetchDocumentAlertsByMatter(matterInfo.name);
        dispatch(setClaimantAlerts(documentAlertsByMatter))
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    if(matterInfo.name) {
      fetchData();
    }
  }, [dispatch, matterInfo.name]);

  // Sorting and Filtering Logic with error handling
  useEffect(() => {
    const filterAndSortAlerts = () => {
      if (!alerts) return; // Ensure alerts are available

      let filtered = [...alerts];

      // Sort by Date (newest to oldest or oldest to newest)
      filtered.sort((a, b) => {
        const dateA = new Date(a.insert_date); // Parsing insert_date
        const dateB = new Date(b.insert_date);
        return isSortNewestFirst ? dateB - dateA : dateA - dateB;
      });

      setFilteredAlerts(filtered);
    };

    filterAndSortAlerts();
  }, [alerts, isSortNewestFirst]);

  const handleToggleRead = (campaign) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.campaign === campaign ? { ...alert, admin_read: !alert.admin_read } : alert
    );
    dispatch(setAlerts(updatedAlerts));
  };

  return (
    <Box
      sx={{
        maxWidth: "30%", 
        padding: "8px",
        pt: "0px",
        borderRight: "1px solid #ccc",
        backgroundColor: "#fff",
      }}
    >
      <Stack sx={{ mt: "8px"}} direction="row" spacing={2} alignItems="center">
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
      </Stack>
      {/* Display Filtered and Sorted Alerts */}
      {filteredAlerts ? (
        filteredAlerts.map((alert, i) => (
          <ClaimantAlertCard
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
  );
};

export default ClaimantAlertList;
