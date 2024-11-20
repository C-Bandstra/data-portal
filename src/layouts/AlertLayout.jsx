//COPY OR USE SIMILAR LAYOUT TO CLAIMANT; WILL BE MINOR DIFFERENCES.
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { ToolBar } from '../components/ToolBar';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import AdminNavigation from '../admin/AdminNavigation';

const AlertLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '90vh',  // Makes the container fill the full height of the viewport
        overflow: 'hidden' // Prevents parent container from scrolling
      }}
    >
      {/* Left Side - List Section */}
      <Box
        sx={{
          width: '25%',   // Takes 1/4th of the screen width
          height: '100%', // Full height of the viewport
          overflowY: 'auto', // Scrollable if content overflows
          borderRight: '1px solid #ccc', // Optional: a dividing line
        }}
      >
        {/* List content goes here */}
      </Box>

      {/* Right Side - Content Section */}
      <Box
        sx={{
          width: '75%',   // Takes 3/4th of the screen width
          height: '100%', // Full height of the viewport
          overflowY: 'auto', // Scrollable if content overflows
        }}
      >
        {/* Content goes here */}
      </Box>
    </Box>
  );
};

export default AlertLayout;