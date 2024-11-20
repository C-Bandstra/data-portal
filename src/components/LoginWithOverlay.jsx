import React, { useState } from 'react';
import { Box } from '@mui/material';
import ClaimantLogin from '../claimant/ClaimantLogin'

const LoginWithOverlay = () => {
  const [redirectLoading, setRedirectLoading] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
    >
      {redirectLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 1)', // semi-transparent overlay
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <img className="logo-redirect pulse" src="/image.png" alt="loading-logo" />
        </Box>
      )}
      <ClaimantLogin setRedirectLoading={setRedirectLoading} />
    </Box>
  );
};

export default LoginWithOverlay;
