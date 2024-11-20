import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#000080",
    },
    secondary: {
      main: "#fff",
    },
  },
  components: {
    JoyTextarea: {
      variants: [
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: '#1976d2',
            color: '#1976d2',
            borderWidth: '1px',
            borderStyle: 'solid',
          },
        },
      ],
    },
  },
});

export default theme;
