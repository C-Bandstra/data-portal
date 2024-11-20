import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';

const CaseNumberInput = ({ matterName, setMatterName }) => {
  const [hasFocused, setHasFocused] = useState(false);

  useEffect(() => {
    let input = document.getElementById("matter-input-field");
    input.addEventListener("focus", () => {
      setHasFocused(true)
    })
  })

  return (
    // <TextField
    //   id="matter-input-field" 
    //   variant="outlined" 
    //   label="Enter your Case Number"
    //   type="text"
    //   value={hasFocused ? matterName : ""}
    //   onChange={(e) => setMatterName(e.target.value)} 
    //   fullWidth
    // />
    <TextField
      id="matter-input-field" 
      label="Enter your Matter Number"
      type="text"
      value={hasFocused ? matterName : ""}
      onChange={(e) => setMatterName(e.target.value)} 
      fullWidth
    />
  );
};

export default CaseNumberInput;
