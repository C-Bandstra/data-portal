import React from "react";
import { ListItem, Box, Typography, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";
import { removeTime, convertISODateToReadable } from "../../utils";

const ClaimantAlertCard = ({ alert, onSelectAlert, selectedAlert, onToggleRead }) => {
  const { campaign, message, insert_date  } = alert;
  // const [checked, setChecked] = useState(false);

  const isSelected = alert?.campaign === selectedAlert?.campaign;

  const typographyStyles = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: '100%',
  };

  // const handleToggleRead = (event) => {
  //   event.stopPropagation();
  //   setChecked(!checked);
  //   if (onToggleRead) {
  //     onToggleRead(campaign);
  //   }
  // };

  const handleSelect = () => {
    // handleToggleRead(e)
    onSelectAlert(alert, campaign)
  }

  return (
    <ListItem
      sx={{
        backgroundColor: isSelected ? "rgba(25,118,210,0.05)" : "#fffffff",
        border: isSelected ? "1px solid rgba(25,118,210, 0.5)" : "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "8px",
        margin: "8px 0",
        transition: "background-color 0.3s ease, transform 0.2s",
        cursor: "pointer",
        transform: isSelected ? "scale(1.02)" : "",
        width: "100%",
        "&:hover": {
          backgroundColor: grey[200],
          transform: "scale(1.02)",
        },
        padding: "0px",
        px: "8px",
        py: "8px"
      }}
      onClick={(e) => handleSelect(e)}
    >
      {/* Alert Content Section */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "600", textDecoration: "underline"}}>
        {removeTime(convertISODateToReadable(insert_date))}
        </Typography>
        <Tooltip title={campaign} arrow>
          <Typography variant="h6" sx={typographyStyles}>
            {campaign}
          </Typography>
        </Tooltip>
        <Tooltip title={message} arrow>
          <Typography variant="body2" color="text.secondary" sx={typographyStyles}>
            {message}
          </Typography>
        </Tooltip>
      </Box>
    </ListItem>
  );
};

export default ClaimantAlertCard;
