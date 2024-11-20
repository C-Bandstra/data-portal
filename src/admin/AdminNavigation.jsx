import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import { UnarchiveRounded } from '@mui/icons-material';
import { Inbox } from '@mui/icons-material';
import { buttonStyles } from '../utils';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { setVerified } from '../redux/slices/sharedSlice';
import { useDispatch } from 'react-redux';

const AdminNavigation = ({ drawerWidth, open, toggleDrawer }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isInbox = location.pathname === "/"
  const isClaimantUploads = location.pathname === "/admin/claimantUploads";
  const isDocusign = location.pathname === "/admin/docusign";

  const handleLogout = () => {
    dispatch(setVerified(false))
    navigate("/");
  }

  const handleDrawerOnClick = () => {
    toggleDrawer();
  }

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        display: open ? 'block' : 'none', // Hides the drawer when closed
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Link to="/" onClick={handleDrawerOnClick}>
            <img className="logo-header" src="/image.png" alt="portal-wagstaff-logo"/> 
        </Link>
        <List>
        <Link className="sidebar-link" to="/" onClick={handleDrawerOnClick}>
          <ListItem button="true" sx={{backgroundColor: isInbox ? "rgba(0,0,128, 0.1)" : ""}}>
            <ListItemIcon>
              <Inbox color="primary"/>
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItem>
        </Link>
        <Link className="sidebar-link" to="/admin/claimantUploads" onClick={handleDrawerOnClick}>
          <ListItem button="true" sx={{backgroundColor: isClaimantUploads ? "rgba(0,0,128, 0.1)" : ""}}>
            <ListItemIcon>
              <UnarchiveRounded color="primary"/>
            </ListItemIcon>
            <ListItemText primary="Claimant Uploads" />
          </ListItem>
        </Link>

        <Link className="sidebar-link" to="/admin/docusign" onClick={handleDrawerOnClick}>
          <ListItem button="true" sx={{backgroundColor: isDocusign ? "rgba(0,0,128, 0.1)" : ""}}>
            <ListItemIcon>
              <UnarchiveRounded color="primary"/>
            </ListItemIcon>
            <ListItemText primary="Docusign" />
          </ListItem>
        </Link>
        
        <ListItem button="true">
            <ListItemIcon>
              <LogoutOutlined color="primary"/>
            </ListItemIcon>
            <Button onClick={handleLogout} sx={buttonStyles} size="small" variant='contained'>Logout</Button>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminNavigation;