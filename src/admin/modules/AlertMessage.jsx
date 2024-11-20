import {useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
// import ClaimantUploadsGrid from "./ClaimantUploadsGrid";
import CombinedGrid from "./CombinedGrid";
import {
  // fetchClaimantUploadsByCampaign, 
  // fetchDocumentAlertsByCampaign
  fetchCombinedByCampaign, 
} from "../../api/adminApiCalls";
import { convertISODateToReadable, removeTime } from "../../utils";
// import DocumentAlertsGrid from "./DocumentAlertsGrid";

const AlertMessage = ({ alert }) => {
  const { campaign, message, insert_date, created_by } = alert;

  // const [claimantRows, setClaimantRows] = useState([]);
  // const [alertRows, setAlertRows] = useState([]);
  const [combinedRows, setCombinedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // await fetchClaimantUploadsByCampaign(alert.campaign, setClaimantRows);
        // await fetchDocumentAlertsByCampaign(alert.campaign, setAlertRows);
        await fetchCombinedByCampaign(alert.campaign, setCombinedRows)
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [alert.campaign]); 


  return (
    <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{fontWeight: 600, textDecoration: "underline"}}>
          {removeTime(convertISODateToReadable(insert_date))}
        </Typography>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Typography variant="h5">
          {campaign}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {created_by}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center",}}>
        <Typography variant="body1" sx={{ margin: "1em 0em" }}>
          {message}
        </Typography>
      </Box>
      {/* <DocumentAlertsGrid rows={alertRows}/>
      <ClaimantUploadsGrid rows={claimantRows}/> */}
      <CombinedGrid rows={combinedRows}/>
    </Box>
  );
};

export default AlertMessage;
