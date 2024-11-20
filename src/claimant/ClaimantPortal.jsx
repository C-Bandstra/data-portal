import { Box, Typography } from '@mui/material';
import '../App.css';
import ClaimantAlertPage from './modules/ClaimantAlertPage';

const ClaimantPortal = () => {
  return (
    <Box>
        <Typography variant="h4" color="primary" sx={{ fontWeight: "500", mb: "2px", fontSize: 'clamp(1.75rem, 2vw, 2rem)', borderBottom: "1px solid #cdd7e1"}}>Claimant Portal</Typography>
        <ClaimantAlertPage />
    </Box>
  )
}

export default ClaimantPortal;