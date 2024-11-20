import { useState } from 'react';
import { Button, Box, Alert, Stack } from '@mui/material';
import GlobalPinVerification from '../components/GlobalPinVerification';
import { handlePinChange, handlePinVerify, adminPin, buttonStyles, emailWhitelist} from '../utils';
import EmailInput from './modules/EmailInput';
import { useDispatch } from 'react-redux';
import { setVerified } from '../redux/slices/sharedSlice';
import { setAdmin, setUser } from '../redux/slices/adminSlice';

const AdminLogin = () => {
  const dispatch = useDispatch();
  //Component State
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [error, setError] = useState('');
  const [lockedOut, setLockedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("@wagstafflawfirm.com");

  const handleSubmit = async () => {
    let emailIsInWhitelist = handleEmailVerify(email);
    handlePinVerify(setError, setAttempts, attempts, setLockedOut, pin, adminPin);
    if (pin === adminPin && emailIsInWhitelist) {
        dispatch(setUser(email));
        setLoading(true); // Set loading state to true
        setTimeout(async () => { // Delay the page navigation
            dispatch(setVerified(true));

            setPin(''); // Clear the PIN input after each attempt
            setLoading(false); // Reset loading state after fetching
        }, 500);
    } else if(pin === adminPin && !emailIsInWhitelist){
      setError("Incorrect Email Credential");
    } else if(pin !== adminPin && !emailIsInWhitelist){
      setError("Both Credentials are incorrect");
    }
  }

  const handleEmailVerify = (email) => {
    return emailWhitelist.includes(email.toLowerCase());
  }

  const handleAdminClick = () => {
    dispatch(setAdmin(false));
  } 

  return (
    <Box className="login-input-container admin-login" sx={{ maxWidth: "450px", m: "0px auto",}}>
        <Box sx={{display: "flex", alignItems: "center", mb: "1em",  gap: 2, maxWidth: "450px", m: "10px auto", justifyContent: "space-between"}}>
            <img className="logo-header" src="/image.png" alt="wagstaff-logo"/>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAdminClick}
            >
              Claimant Login
            </Button>
        </Box>
        <Stack direction="column" spacing={2}>
            {/* Left side - New Inputs (DoB, Last Name, Email) */}
            <Box sx={{display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{display: "flex", gap: 2}}>
                <EmailInput value={email} onChange={setEmail}/>
                <GlobalPinVerification pin={pin} onChange={(e) => handlePinChange(e, setPin)} lockedOut={lockedOut}/>

                </Box>
                
                {error && <Alert severity={lockedOut ? 'error' : 'warning'} sx={{ mt: 2 }}>{error}</Alert>}
            </Box>

            {/* Divider between the new and old inputs */}
        </Stack>
        <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={[buttonStyles, { mt: "1em"}]}
            fullWidth
        >
            {loading ? 'Loading...' : 'Submit'}
        </Button>
    </Box>
  )
}

export default AdminLogin;
