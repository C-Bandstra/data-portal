import React, { useState } from "react";
import AlertList from "./AlertList";
import AlertMessage from "./AlertMessage";
import { Box, Typography } from "@mui/material";

const AlertPage = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
  };

  return (
    <Box sx={{display: "flex", backgroundColor: "#f0f0f0", overflow: "hidden",}}>
      <Box
        sx={{
          minWidth: "30%",
          maxWidth: "30%",
          padding: "10px",
          borderRight: "1px solid #ccc",
          backgroundColor: "#fff",
        }}
      >
        <AlertList onSelectAlert={handleSelectAlert} selectedAlert={selectedAlert}/>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          padding: "24px",
          backgroundColor: "#f9f9f9",
          overflow: "scroll",
          scrollbarWidth: "none",
        }}
      >
        {selectedAlert ? (
          <AlertMessage alert={selectedAlert} />
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

export default AlertPage;
