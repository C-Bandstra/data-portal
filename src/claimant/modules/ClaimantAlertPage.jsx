import React, { useState } from "react";
import ClaimantAlertList from "./ClaimantAlertList";
import ClaimantAlertMessage from "./ClaimantAlertMessage";
import { Box, Typography } from "@mui/material";
import { setCurrentCampaign } from "../../redux/slices/claimantSlice";
import { useDispatch } from "react-redux";

const ClaimantAlertPage = () => {
  const dispatch = useDispatch();
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleSelectAlert = async (alert, campaign) => {
    setSelectedAlert(alert);
    dispatch(setCurrentCampaign(campaign));
  };

  return (
    <Box sx={{display: "flex", backgroundColor: "#f0f0f0", overflow: "hidden",}}>
      <ClaimantAlertList onSelectAlert={handleSelectAlert} selectedAlert={selectedAlert}/>
      <Box
        sx={{
          flexGrow: 1,
          padding: "24px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {selectedAlert ? (
          <ClaimantAlertMessage alert={selectedAlert} />
        ) : (
          <Typography
            sx={{ fontStyle: "italic", marginTop: "20px", fontSize: "1.25em" }}
          >
            Please select an alert to view its details.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ClaimantAlertPage;
