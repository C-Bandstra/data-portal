import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline} from '@mui/material';
import { ToolBar } from '../components/ToolBar';
import ClaimantNavigation from '../claimant/ClaimantNavigation';

const ClaimantPortalLayout = () => {
  const [open, setOpen] = useState(false);
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ClaimantNavigation drawerWidth={drawerWidth} open={open} toggleDrawer={handleDrawerToggle}/>
      <ToolBar title="Claimant Portal" handleDrawerToggle={handleDrawerToggle} open={open} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          width: "100%",
          paddingTop: 3,
          transition: 'margin 0.3s ease',
        }}
      >
        <Box sx={{mt: "3em"}}>
          <Outlet/> 
        </Box>
      </Box>
    </Box>
  );
};

export default ClaimantPortalLayout;