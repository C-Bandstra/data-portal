import React from 'react';
import { TextField } from '@mui/material';

const GlobalPinVerification = ({ pin, onChange, lockedOut }) => {
  return (
    <TextField
      className="login-input"
      label="Enter your PIN"
      sx={{ minWidth: "145px", maxWidth: "145px"}}
      type="password"
      value={pin ? pin : ""}
      onChange={(e) => onChange(e)}
      disabled={lockedOut}
      slotProps={{ maxLength: 4, }}
      // fullWidth
    />
  );
};

export default GlobalPinVerification;