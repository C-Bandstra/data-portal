import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const MaintenancePage = ({ setAdmin }) => {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        bgcolor: '#f2f2f2',
        color: '#333',
        p: 4
      }}
    >
      <img className="logo-header" src="/image.png" alt="wagstaff-logo"/>
      <Typography variant="h2" gutterBottom>
        We’ll Be Right Back!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Our site is currently down for scheduled maintenance. We’re working hard to get things back up as soon as possible.
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Thank you for your patience.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={refreshPage}
        sx={{ mt: 3 }}
      >
        Refresh Page
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={setAdmin}
        sx={{ mt: 3 }}
      >
        Admin
      </Button>
    </Box>
  );
};

export default MaintenancePage;
