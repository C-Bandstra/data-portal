import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

const EmailInput = ({ value, onChange }) => { //HANDLE VERIFICATION IN UTIL FUNCTION 
  const [hasFocused, setHasFocused] = useState(false);

  useEffect(() => {
    const input = document.getElementById("matter-input-field");

    const handleFocus = () => {
      setHasFocused(true);
      // Move cursor to the start of the value
      setTimeout(() => {
        input.setSelectionRange(0, 0);
      }, 0); // Delay to ensure it happens after focus
    };

    input.addEventListener("focus", handleFocus);

    return () => {
      input.removeEventListener("focus", handleFocus);
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <TextField
      id="matter-input-field" 
      label="Enter your Wagstaff Email"
      variant="outlined" 
      size="large"
      fullWidth
      value={hasFocused ? value : ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default EmailInput;