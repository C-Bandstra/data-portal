import React, { useState } from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import CaseInfo from './CaseInfo';

const ViewCaseInfoButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{marginLeft: "3em"}}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        View Info
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          style: {
            width: 'auto',
            padding: '16px',
          },
        }}
      >
        <MenuItem sx={{p: "0px"}} onClick={handleClose}>
          <CaseInfo />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ViewCaseInfoButton;


