import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom/dist";
import { storeTokensFromUrl } from "./docusign";
import { setUser, setAdmin } from './redux/slices/adminSlice';
import { Box } from "@mui/material";
import { setVerified } from './redux/slices/sharedSlice';

const DocusignRedirect = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);  // Loading state to control the delay

  useEffect(() => {
    const { email } = storeTokensFromUrl(location) || {};  // Extract email

    if (email) {
      dispatch(setUser(email));
      dispatch(setAdmin(true));
      dispatch(setVerified(true));
      
      // Wait for 1 or 2 seconds before redirecting
      setTimeout(() => {
        setLoading(false); // Set loading after the timeout
        navigate("/");
      }, 2500);
    } else {
      // If no email, you could navigate away or show an error message
      navigate("/error");
    }
  }, [location, dispatch, navigate]);

  // Show loading message/spinner while waiting
  if (loading) {
    return (
      <Box
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
      </Box>
    )
  }
  // Return null or loading component will handle UI
  return null;
};

export default DocusignRedirect;