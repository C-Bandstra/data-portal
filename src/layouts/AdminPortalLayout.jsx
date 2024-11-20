import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline,Toolbar} from '@mui/material';
import { ToolBar } from '../components/ToolBar';
import AdminNavigation from '../admin/AdminNavigation';

const AdminPortalLayout = () => {
  const [open, setOpen] = useState(false);
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminNavigation drawerWidth={drawerWidth} open={open} toggleDrawer={handleDrawerToggle}/>
      <ToolBar title="Admin Portal" handleDrawerToggle={handleDrawerToggle} open={open} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          width: "100%",
          transition: 'margin 0.3s ease',
        }}
      >
        <Toolbar/>
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default AdminPortalLayout;