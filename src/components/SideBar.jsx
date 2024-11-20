import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button } from '@mui/material';
import { ContactMail as ContactMailIcon } from '@mui/icons-material';
import { LogoutOutlined } from '@mui/icons-material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { buttonStyles } from '../utils';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { setVerified } from '../redux/slices/sharedSlice';
import { useDispatch } from 'react-redux';

const SideBar = ({ drawerWidth, open }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isContactInfoPage = location.pathname === '/claimant/contactInfo';
  const isCaseInfoPage = location.pathname === "/";

  const handleLogout = () => {
    dispatch(setVerified(false))
    navigate("/");
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
        {/* <Typography variant="h6" noWrap sx={{ padding: 2 }}>
          Logo
        </Typography> */}
        <Link to="/">
            <img className="logo-header" src="/image.png" alt="portal-wagstaff-logo"/> 
        </Link>
        <List>
        <Link className="sidebar-link" to="/">
            <ListItem button sx={{backgroundColor: isCaseInfoPage ? "rgba(0,0,128, 0.1)" : ""}}>
              <ListItemIcon>
                <BusinessCenterIcon />
              </ListItemIcon>
              <ListItemText primary="Case Info" />
            </ListItem>
          </Link>
          <Link className="sidebar-link" to="/claimant/contactInfo">
            <ListItem button sx={{backgroundColor: isContactInfoPage ? "rgba(0,0,128, 0.1)" : ""}}>
              <ListItemIcon>
                <ContactMailIcon />
              </ListItemIcon>
              <ListItemText primary="Contact Info" />
            </ListItem>
          </Link>
          <ListItem button>
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              <Button onClick={handleLogout} sx={buttonStyles} size="small" variant='contained'>Logout</Button>
            </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SideBar;