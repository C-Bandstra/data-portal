import { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material'
import { fetchMatterCompletedStatus } from '../../api/claimantApiCalls'
import { createDocusignConsoleView } from "../../docusign";

// export const ViewDocumentButton = ({ urlData }) => {
//   const [statusComplete, setStatusComplete] = useState(null);
//   // const [consoleViewUrl, setConsoleViewUrl] = useState(null);
//   const [buttonClicked, setButtonClicked] = useState(false);

//   const { envelopeId, matter } = urlData

//   useEffect(() => {
//     const fetchAndUpdateUrl = async () => {
//       try {
//         // Build console view URL
//         const adminConsoleViewUrl = await createDocusignConsoleView(envelopeId);
//         // setConsoleViewUrl(adminConsoleViewUrl);
//         window.open(adminConsoleViewUrl, "_blank", "noopener,noreferrer");
        
//       } catch (error) {
//         console.error('Error during URL Creation:', error);
//       }
//     }
    
//     if (statusComplete && buttonClicked) {
//       fetchAndUpdateUrl(); // Call the async function
//       setButtonClicked(false);
//     };
//   }, [statusComplete, envelopeId, buttonClicked]);

//   useEffect(() => {
//     const checkRecipientCompletedStatus = async () => {

//       const {recipient_signed_completed} = await fetchMatterCompletedStatus(matter, envelopeId);
  
//       if(recipient_signed_completed === 1) {
//         setStatusComplete(true)
//       } else {
//         setStatusComplete(false);
//       }
//     }

//     if(matter) {
//       checkRecipientCompletedStatus();
//     } else {
//       console.error("No matter available for completed status")
//     }

//   }, [matter, envelopeId])

//   //ONCLICK YOU SHOULD GRAB THE ENVELOPE ID ASSOCIATED WITH THIS ROW/BUTTON AND USE THAT IN THE adminConsoleView FLOW

//   const handleClick = () => {
//     setButtonClicked(true);
//   }

//   return (
//     <Box sx={{height: "100%", display: "flex", alignItems: "center"}}>
//       {statusComplete ? (
//         <Button onClick={handleClick} variant="outlined" style={{ cursor: "pointer" }}>
//           View Document
//         </Button>
//       ) : (
//         <p>No Document Available</p>
//       )}
//     </Box>
//   );
// }


export const ViewDocumentButton = ({ urlData }) => {
  const [statusComplete, setStatusComplete] = useState(null);
  const [loading, setLoading] = useState(false);

  const { envelopeId, matter } = urlData;

  useEffect(() => {
    const checkRecipientCompletedStatus = async () => {
      try {
        const { recipient_signed_completed } = await fetchMatterCompletedStatus(matter, envelopeId);
        setStatusComplete(recipient_signed_completed === 1);
      } catch (error) {
        console.error("Error checking recipient status:", error);
      }
    };

    if (matter) {
      checkRecipientCompletedStatus();
    } else {
      console.error("No matter available for completed status");
    }
  }, [matter, envelopeId]);

  const handleClick = async () => {
    if (!statusComplete) return;

    setLoading(true);
    try {
      const adminConsoleViewUrl = await createDocusignConsoleView(envelopeId);
      window.open(adminConsoleViewUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error during URL Creation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
      {statusComplete ? (
        <Button onClick={handleClick} variant="outlined" disabled={loading} style={{ cursor: "pointer" }}>
          {loading ? "Loading..." : "View Document"}
        </Button>
      ) : (
        <p>No Document Available</p>
      )}
    </Box>
  );
};

