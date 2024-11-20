import { Toolbar, Box, IconButton, AppBar } from '@mui/material';
import { useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
// import { keyframes } from '@mui/system';
import CreateAlertForm from '../admin/modules/CreateAlertForm';
import ViewCaseInfoButton from '../claimant/modules/ViewCaseInfoButton';

export const ToolBar = ({ title, handleDrawerToggle, open, drawerWidth }) => {
  // const [hasUnreadAlerts, setHasUnreadAlerts] = useState(false);

  const isAdmin = useSelector((state) => state.admin.isAdmin);

  // const handleAlertsStatusChange = (hasUnread) => {
  //   setHasUnreadAlerts(hasUnread);
  // };

  console.log(title)

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${open ? drawerWidth : 0}px)`,
        ml: open ? `${drawerWidth}px` : 0,
        transition: 'width 0.3s ease, margin 0.3s ease',
        backgroundColor: "white",
        // ...(hasUnreadAlerts && pulsateBorder), // Apply enhanced animation if there are unread alerts
      }}
    >
      <Toolbar sx={{ display: "flex", ml: "0.5em",}}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            >
            <MenuIcon sx={{ color: "#000080" }} />
          </IconButton>
          {!open && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img className="logo-header" src="/image.png" alt="portal-wagstaff-logo" />
            </Box>
          )}
          <Box>
            { !isAdmin && <ViewCaseInfoButton />}
          </Box>
        <Box>
          { isAdmin && <CreateAlertForm />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
