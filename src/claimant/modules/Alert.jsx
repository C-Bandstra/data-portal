import { useState, useEffect } from "react";
import { Popover, Button, List, Badge, Typography, Box, Switch } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { buttonStyles } from "../../utils";
import AlertCard from "./AlertCard";

const Alert = ({ onUnreadStatusChange }) => {
  const [anchorElement, setAnchorElement] = useState(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const [alerts, setAlerts] = useState(() => [
    {
      id: 1,
      title: "File Birth Certificate",
      content: "https://example.com/uploadBirthCertificate",
      timestamp: "2024-09-17 10:00",
      isRead: true,
    },
    {
      id: 2,
      title: "Sign Bankruptcy Document",
      content: "https://example.com/signDoc",
      timestamp: "2024-09-16 09:30",
      isRead: false,
    },
    {
      id: 3,
      title: "Send Receipt",
      content: "https://example.com/sendReceipt",
      timestamp: "2024-09-15 14:45",
      isRead: false,
    },
  ].sort((a, b) => a.isRead - b.isRead)); // Sort initially by isRead status

  const open = Boolean(anchorElement);
  const id = open ? "simple-popover" : undefined;
  const hasUnread = alerts.some(alert => !alert.isRead);

  useEffect(() => {
    if (onUnreadStatusChange) {
      onUnreadStatusChange(hasUnread);
    }
  }, [alerts, onUnreadStatusChange, hasUnread]);

  const handleToggleRead = (index) => {
    setAlerts((prevAlerts) => {
      const updatedAlerts = [...prevAlerts];
      updatedAlerts[index] = {
        ...updatedAlerts[index],
        isRead: !updatedAlerts[index].isRead,
      };

      return updatedAlerts.sort((a, b) => a.isRead - b.isRead); // Keep sorted after toggling
    });
  };

  const handleClick = (e) => {
    setAnchorElement(anchorElement ? null : e.currentTarget);
  };

  const handleToggleChange = () => {
    setShowUnreadOnly(!showUnreadOnly);
  };

  const filteredAlerts = showUnreadOnly ? alerts.filter(alert => !alert.isRead) : alerts;

  return (
    <Button 
      onClick={(e) => handleClick(e)} 
      sx={{ ...buttonStyles, borderRadius: "25px", mr: "10px" }}
      size="small" 
      variant="outlined"
    >
      <Badge
        badgeContent={hasUnread ? alerts.filter(alert => !alert.isRead).length : null}
        color="error"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          justifyContent: "end",
        }}
      >
        <NotificationsIcon />
      </Badge>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: "300px",
            maxWidth: "500px",
            width: "auto",
            position: "absolute",
            top: "90px !important",
            "@media (max-width:600px)": {
              minWidth: "90vw",
              maxWidth: "90vw",
              left: "50%",
              transform: "translateX(-50%)",
            },
            "@media (min-width:601px)": {
              left: "0",
              transform: "none",
              minWidth: "412.5px"
            },
          },
        }}
      >
        <Box onClick={(e) => e.stopPropagation()} sx={{ p: "1em", display: "flex", flexDirection: "column", height: "100%" }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
            Alerts
            <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Only show unread
              </Typography>
              <Switch
                checked={showUnreadOnly}
                onChange={handleToggleChange}
              />
            </Box>
          </Typography>
          <Box sx={{ mt: 2, overflow: "auto" }}>
            {filteredAlerts.length > 0 ? (
              <List sx={{ padding: "5px", margin: 0 }}>
                {filteredAlerts.map((alert, index) => (
                  <AlertCard
                    key={alert.id}
                    title={alert.title}
                    content={alert.content}
                    timestamp={alert.timestamp}
                    isRead={alert.isRead}
                    onToggleRead={() => handleToggleRead(index)}
                  />
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No Alerts for now
              </Typography>
            )}
          </Box>
        </Box>
      </Popover>
    </Button>
  );
};

export default Alert;
