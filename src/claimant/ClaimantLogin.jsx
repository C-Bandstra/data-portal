import { useEffect, useState } from 'react';
import GlobalPinVerification from '../components/GlobalPinVerification';
import CaseNumberInput from './modules/CaseNumberInput';
import { fetchMatterInfo, fetchMatterNameWithClaimantCreds } from '../api/claimantApiCalls';
import { 
  handlePinChange, 
  handlePinVerify, 
  claimantPin, 
  buttonStyles,
  getClientUserIdFromUrl
} from '../utils';
import { 
  Box,
  Button, 
  Alert, 
  // TextField, 
  // Divider, 
  Stack,
  // Typography,
} from '@mui/material';
import { setVerified } from '../redux/slices/sharedSlice';
import { setMatterInfo } from '../redux/slices/claimantSlice';
import { useDispatch } from 'react-redux';
import { setAdmin } from '../redux/slices/adminSlice';

const ClaimantLogin = ({ setRedirectLoading }) => {
  const dispatch = useDispatch();
  
  // Component State
  const [matterName, setMatterName] = useState("");
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [primaryError, setPrimaryError] = useState(''); // Error for primary login
  const [secondaryError, setSecondaryError] = useState(''); // Error for secondary login
  const [lockedOut, setLockedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestLogIn, setRequestLogIn] = useState(null);
  
  // New Input States
  const [dob, setDob] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchMatterInfoAndVerifyFromRedirect = async () => {
      const matter = getClientUserIdFromUrl(window.location.search);
      
      if (matter) {  
        setMatterName(matter);
        setRequestLogIn(true)
      }
    };
  
    fetchMatterInfoAndVerifyFromRedirect();  
  }, [dispatch, setRedirectLoading]);

  useEffect(() => {
    if (requestLogIn && matterName) {
        setLoading(true);
        setTimeout(async () => {
            const matterInfo = await fetchMatterInfo(matterName);
            if(matterInfo) {
              dispatch(setMatterInfo(matterInfo));
              dispatch(setVerified(true));
              setPin(''); 
              setLoading(false); 
            } else {
              setPrimaryError("Incorrect Matter Number"); // Set primary error
              setLoading(false);
            }
        }, 500);
    }
  }, [requestLogIn, matterName, dispatch]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
        // Check if any secondary fields are filled
        if (email || lastName || dob) {
            // Validate secondary fields
            if (!email) {
                setSecondaryError("Email is required.");
                return; // Stop further execution
            }
            if (!lastName) {
                setSecondaryError("Last Name is required.");
                return; // Stop further execution
            }
            if (!dob) {
                setSecondaryError("Date of Birth is required.");
                return; // Stop further execution
            }

            // All secondary fields are filled, proceed with fetching matter info
            let matterResponse = await fetchMatterNameWithClaimantCreds(email, dob, lastName);
            
            // Check if the matterResponse is valid
            if (matterResponse) {
                setMatterName(matterResponse);
                setPin(claimantPin);
                setRequestLogIn(true);
            } else {
                // Handle invalid matterResponse
                setSecondaryError('Invalid matter response received');
            }
        } else {
            // No secondary fields filled, check primary login
            let verified = handlePinVerify(setPrimaryError, setAttempts, attempts, setLockedOut, pin, claimantPin);
            if (verified) {
                setRequestLogIn(true);
            } else {
                setPrimaryError("Invalid PIN.");
            }
        }
    } catch (error) {
        // Adjust error handling based on the context of the call
        if (email || lastName || dob) {
          console.log(secondaryError) //remove when using secondary login
            setSecondaryError(error.message || 'An error occurred while fetching the matter name');
        } else {
            setPrimaryError(error.message || 'An error occurred while fetching the matter name');
        }
    } finally {
        setLoading(false); // Stop loading regardless of success or error
    }
};
  
  useEffect(() => {
    if(matterName.length || pin.length) {
      setDob("");
      setLastName("");
      setEmail("");
      setPrimaryError("")
      setSecondaryError("")
    }
  }, [matterName, pin]);

  useEffect(() => {
    if(email.length || lastName.length || dob.length) {
      setMatterName("");
      setPin("");
      setPrimaryError("")
      setSecondaryError("")
    }
  }, [email, lastName, dob]);

  const handleAdminClick = () => {
    dispatch(setAdmin(true));
  };

  return (
    loading ?
      (<Box
        sx={{
          position: 'relative',
          height: '100%',  // Full height of the viewport
          width: '100%',   // Full width of the viewport
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: 'column'
          }}
        >
          <img class="logo-redirect pulse" src="/image.png" alt="wagstaff-logo" />
        </Box>
      </Box>) :

    (<Box className="login-input-container" sx={{ maxWidth: "450px", m: "0px auto",}}>
        <Box sx={{ display: "flex", alignItems: "center", mb: "1em", gap: 2, m: "10px auto", justifyContent: "space-between" }}>
            <img className="logo-header" src="/image.png" alt="wagstaff-logo"/>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleAdminClick}
            >
                Admin Login
            </Button>
        </Box>

        <Stack direction="column" spacing={2}>
            {/* Left side - New Inputs (DoB, Last Name, Email) */}
            <Box sx={{display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{display: "flex", gap: 2}}>
                  <CaseNumberInput matterName={matterName} setMatterName={setMatterName} />

                  <GlobalPinVerification pin={pin} onChange={(e) => handlePinChange(e, setPin)} lockedOut={lockedOut} /> 

                </Box>
                
                {primaryError && <Alert severity={lockedOut ? 'error' : 'warning'} sx={{ mt: 2 }}>{primaryError}</Alert>}
            </Box>

            {/* <Divider orientation="horizontal" flexItem>
             <Typography> OR</Typography>
            </Divider>

            <Box sx={{display: "flex", flexDirection: "column", gap: 2, opacity: "0.5" }}>
                <TextField
                    label="Enter Email of Claimant"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
                <Box sx={{display: "flex", gap: 2}}>
                  <TextField
                    label="Enter Last Name of Claimant"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    />
                  <TextField
                      label="Claimant Date of Birth"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      slotProps={{inputLabel: { shrink: true }}}
                      sx={{minWidth: "145px", maxWidth: "175px"}}
                      />
                </Box>
            </Box>
            {secondaryError && <Alert severity="warning" sx={{ mt: 1 }}>{secondaryError}</Alert>} */}
        </Stack>
        <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={[buttonStyles, { mt: "1em"}]}
            fullWidth
        >
            {loading ? 'Loading...' : 'Login'}
        </Button>
    </Box>
    )
  );
};

export default ClaimantLogin;
