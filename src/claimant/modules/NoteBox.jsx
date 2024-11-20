import React from 'react';
import { Typography } from '@mui/material';
import { Textarea } from '@mui/joy';
import '../../App.css';
import theme from '../../theme';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';

const NoteBox = ({ value, onChange }) => {
  return (
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Textarea
          onChange={(event) => onChange(event.target.value)}
          value={value}
          placeholder="Enter your note..."
          variant="outlined" // Using the built-in outlined variant
          color={theme.palette.primary.main}     // Specify the color directly
          size="lg"          // Optionally specify size
          sx={{ minHeight: '10em', paddingBottom: '0px', mt: '0.5em', }} // Custom styles as needed
          endDecorator={
            <Typography level="body-xs" sx={{ ml: 'auto' }}>
              {1000 - value.length}/1000
            </Typography>
          }
        />
      </JoyCssVarsProvider>
  );
};

export default NoteBox;