import React, { useState, useEffect } from "react";
import { Typography, Box, Divider, Button } from "@mui/material";
import { convertISODateToReadable } from "../../utils";
import DocumentUploader from "./DocumentUploader";
import { removeTime, buttonStyles } from "../../utils";
import { createDocusignRecipientView, getDocusignEnvelopeDetails, getDocusignRecipientDetails } from "../../docusign";
import { getFormattedDate } from "../../utils";
import { 
  checkClaimantUploadByDocumentId,
  createClaimantUpload,
  // updateClaimantUrlByDocumentId,
  fetchMatterCompletedStatus
 } from "../../api/claimantApiCalls";
// import { createDocusignConsoleView } from "../../docusign";
import { 
  useSelector,
  // useDispatch
} from "react-redux";
// import { useEnvelopeCache } from "../../cache/EnvelopeCacheContext";
// import { cacheEnvelope } from "../../redux/slices/envelopesSlice";

const ClaimantAlertMessage = ({ alert }) => {
  const { 
    campaign, 
    message,
    insert_date,
    alert_document_url,
    created_by 
  } = alert;
  
  const matterInfo = useSelector((state) => state.claimant.matterInfo);
  const currentCampaign = useSelector((state) => state.claimant.currentCampaign);

  const [isHovered, setIsHovered] = useState(false);
  
  // const { addToCache, getFromCache, hasInCache } = useEnvelopeCache();

  const envelopeId = alert_document_url.replace('envelopes/', '');
  // const envelopeDetails = useSelector((state) => state.envelopes[envelopeId]);
  const [envelopeDetails, setEnvelopeDetails] = useState(null);
  const [statusComplete, setStatusComplete] = useState(null);
  // const dispatch = useDispatch();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // const handleStatusComplete = async () => {

  // }


  // useEffect(() => {
  //   if (!envelopeId) return;

  //   const fetchAndStoreEnvelopeDetails = async () => {
  //     if (hasInCache(envelopeId)) {
  //       const details = getFromCache(envelopeId);
  //       dispatch(cacheEnvelope({ id: envelopeId, details: details })); // No changes here
  //     } else {
  //       try {
  //         const details = await getDocusignEnvelopeDetails(envelopeId);
  //         dispatch(cacheEnvelope({ id: envelopeId, details: details })); // No changes here
  //         addToCache(envelopeId, details); // No changes here
  //       } catch (error) {
  //         console.error('Error fetching envelope details:', error);
  //       }
  //     } 
  //   };

  //   fetchAndStoreEnvelopeDetails();
  
  // }, [envelopeId, addToCache, getFromCache, hasInCache, dispatch]);

  // useEffect(() => {
  //   const fetchAndUpdateUrl = async () => {
  //     const claimantUpload = await checkClaimantUploadByDocumentId(envelopeDetails?.envelopeId);
  //     if (statusComplete && !claimantUpload?.url) {
  //       try {
  //         // Build console view URL
  //         const adminConsoleViewUrl = await createDocusignConsoleView(envelopeDetails.envelopeId);
  
  //         // Save console view URL to the claimantUploads URL
  //         const addUrlResponse = await updateClaimantUrlByDocumentId(envelopeDetails.envelopeId, adminConsoleViewUrl);
  
  //         // Optionally handle response if needed
  //         console.log('URL updated successfully:', addUrlResponse);
  //       } catch (error) {
  //         console.error('Error during URL update:', error);
  //       }
  //     }
  //   };
  
  //   fetchAndUpdateUrl(); // Call the async function
  // }, [statusComplete, envelopeDetails]);

  useEffect(() => {
    const fetchEnvelopeDetails = async () => {
      try {
        const details = await getDocusignEnvelopeDetails(envelopeId);
        setEnvelopeDetails(details);

        const completedResponse = await fetchMatterCompletedStatus(matterInfo.name, envelopeId);

        if(completedResponse?.recipient_signed_completed === 1) {
          setStatusComplete(true)
        } else {
          setStatusComplete(false);
        }
      } catch (error) {
        console.error('Error fetching envelope details:', error);
      }
    };

    if(matterInfo && envelopeId && alert_document_url) {
      fetchEnvelopeDetails();  // Call the async function
    }
  
  }, [alert_document_url, envelopeId, matterInfo]);

  const handleViewDocument = async () => {
    const formattedDate = getFormattedDate();

    const uploadIfAvailable = await checkClaimantUploadByDocumentId(envelopeDetails?.envelopeId);

    console.log("CHECKING IF UPLOAD EXISTS: ", uploadIfAvailable);

    if(!uploadIfAvailable.exists) {
      await createClaimantUpload({
          formattedDate,
          documentId: envelopeDetails?.envelopeId,
          matterNumber: matterInfo.name,
          campaign: currentCampaign
      });
    }

    console.log("CURRENT DETAILS: ", envelopeDetails)

    const recipientsDetails = await getDocusignRecipientDetails(envelopeDetails?.recipientsUri);

    const currentRecipient = recipientsDetails.signers.find(recipient => recipient.clientUserId === matterInfo.name);

    console.log("Claimant Message: ", recipientsDetails)
    const recipientViewUrl = await createDocusignRecipientView(
        alert_document_url.replace('envelopes/', ''), // returnUrl // URL recipient will be redirected to after signing
        currentRecipient.recipientIdGuid, // authenticationMethod // How the recipient is authenticated
        currentRecipient.name, // userName // Recipient's full name
        currentRecipient.email, // email
        currentRecipient.clientUserId, // clientUserId // Must match the `clientUserId` used when creating the envelope
        currentRecipient.recipientId, // recipientId // Matches the recipientId on envelope creation
    );
    // setRecipientViewUrl(recipientViewUrl);
    window.location.href = recipientViewUrl;
    // window.open(recipientViewUrl, '_blank', 'noopener,noreferrer');
    //Use alert_document_url to make start the document viewer flow
  }

  const buttonText = envelopeDetails === null
  ? "Building document link"
  : isHovered
  ? "View Document"
  : statusComplete
  ? "No Action Required"
  : "Document Requires Action";

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Typography variant="h5">
          {campaign}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {created_by} - {removeTime(convertISODateToReadable(insert_date))}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center",}}>
        <Typography variant="body1" sx={{ margin: "1em 0em" }}>
          {message}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column",}}>
        <Typography variant="caption" sx={{textDecoration: "underline"}}>Document Link:</Typography>
        <Button
          id="form-submit"
          onClick={handleViewDocument}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          variant="contained"
          color="error"
          sx={[buttonStyles, { mt: '10px' }]}
        >
          {buttonText}
        </Button>
      </Box>
      <Box sx={{maxWidth: "100px"}}>
        {/* <FileQuickViewCard fileName="PlaintiffFactSheet.pdf" fileSize="1.5 MB" /> */}
      </Box>
      {!statusComplete && (
        <>
          <Divider sx={{ mt: "1em" }} orientation="horizontal" flexItem />
          <DocumentUploader alertDocumentUrl={alert_document_url}/>
        </>
      )}
      {/* { recipientViewUrl && <DocusignEmbed recipientViewUrl={recipientViewUrl}/> } */}
    </Box>
  );
};

export default ClaimantAlertMessage;
