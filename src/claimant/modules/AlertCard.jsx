import React, { useState } from "react";
import { ListItem, Checkbox, Box, Typography, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";

const AlertCard = ({ title, content, timestamp, isRead, onToggleRead }) => {
  const [checked, setChecked] = useState(isRead);

  const typographyStyles = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flexShrink: 1,
  };

  const handleToggleRead = (event) => {
    event.stopPropagation();
    setChecked(!checked);
    if (onToggleRead) {
      onToggleRead(); // Notify the parent component about the change
    }
  };

  return (
    <ListItem
      sx={{
        backgroundColor: checked ? grey[300] : "rgba(25,118,210,0.10)",
        border: checked ? "none" : "1px solid rgba(25,118,210, 0.7)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "5px",
        margin: "5px 0",
        padding: "10px", // Added padding for better spacing
        overflow: "hidden", // Ensure no overflow outside the card
      }}
    >
      {/* Checkbox for marking as read/unread */}
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Checkbox
          checked={checked}
          onChange={handleToggleRead}
          sx={{ padding: "10px" }}
        />
        <Typography
          variant="caption"
          sx={{
            whiteSpace: "nowrap",
            color: grey[600],
            visibility: checked ? "visible" : "hidden",
          }}
          >
            Seen
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "calc(100% - 60px)", // Adjust width to fit content with checkbox
          overflow: "hidden",
        }}
      >
        {/* Title with Tooltip for long text */}
        <Tooltip title={title} arrow>
          <Typography
            variant="h6"
            sx={typographyStyles}
          >
            {title}
          </Typography>
        </Tooltip>

        {/* Content with Tooltip for long text */}
        <Tooltip title={content} arrow>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={typographyStyles}
          >
            {content}
          </Typography>
        </Tooltip>

        {/* Timestamp */}
        <Typography variant="caption" color="text.secondary">
          {timestamp}
        </Typography>
      </Box>
    </ListItem>
  );
};

export default AlertCard;
