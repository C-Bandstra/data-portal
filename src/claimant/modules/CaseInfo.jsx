import {useState, useEffect} from"react";
import "../../App.css";
import {Box} from "@mui/material";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { removeTime } from "../../utils";

const CaseInfo = () => {
  //Redux State
  const matterInfo = useSelector((state) => state.claimant.matterInfo);
  //Component State
  const [delayedMatterInfo, setDelayedMatterInfo] = useState(null);

  const trimmedDate = removeTime(matterInfo.CreatedDate);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedMatterInfo(matterInfo);
    }, 300); // 500ms delay

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [matterInfo]);

  let caseInfoPairStyling = {
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
      md: "row",
      lg: "row",
      xl: "row"
    },
    // alignItems: "center",
    gap: {
      xs: 0,
      sm: 1,
      md: 1,
      lg: 1,
      xl: 1
    },
  }

  return (
    <Box className="case-info" sx={{display: "flex", flexDirection: "column", width: "100%", margin: "0px 10px"}}>
      <Box sx={[caseInfoPairStyling, {borderBottom: "1px solid #cdd7e1"}]}>
          <Typography 
            variant="h4" 
            color="#000080" 
            className="matter-number" 
            sx={{
              fontSize: "26px", 
              margin: "auto",
            }}
          >
            {delayedMatterInfo ? delayedMatterInfo.name : ""}
          </Typography>
      </Box>
        <Box sx={caseInfoPairStyling}>
          <Typography className="case-info-pair" variant="h6" color="#000080">
            Status: 
          </Typography>
          <Typography color="primary" variant="h6">{delayedMatterInfo ? delayedMatterInfo.litify_pm__Status : ""}</Typography>
        </Box>
        <Box sx={caseInfoPairStyling}>
          <Typography className="case-info-pair" variant="h6" color="#000080">
            Name:
          </Typography>
          <Typography color="primary" variant="h6">{delayedMatterInfo ? delayedMatterInfo.litify_pm__Display_Name : ""}</Typography>
        </Box>
        <Box sx={caseInfoPairStyling}>
          <Typography className="case-info-pair" variant="h6" color="#000080">
            Created Date:
          </Typography>
          <Typography color="primary" variant="h6">{delayedMatterInfo ?  trimmedDate : ""}</Typography>
        </Box>
    </Box>
  )
}

export default CaseInfo;