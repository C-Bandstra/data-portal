import "../../App.css";
import { Box, Button } from "@mui/material";
import { tags } from "../../utils";
import FileQuickViewCard from "../../components/FileQuickViewCard";

const DocumentPreview = ({ name, size, handleAddTag, handleRemoveFile, indexInPreviews,}) => {
  const optionElements = tags.map((tag, i) => (
    <option value={tag} key={i}>{tag}</option>
  ));

  return (
    <Box sx={{width: "fit-content", display: "flex", flexDirection: "column", mr: "1.5em", padding: "4px", borderRadius: "6px",}}>
      <FileQuickViewCard fileName={name}/>
      <Box sx={{mt: "4px", display: "flex", alignItems: "center"}}>
        <select 
          className="tag-selection" 
          name="options" 
          onChange={(e) => handleAddTag(indexInPreviews, e.target.value)}
        >
          {optionElements}
        </select>
        <Button
          onClick={() => handleRemoveFile(indexInPreviews)}
          size="small"
          variant="contained"
          disableElevation
          sx={{ backgroundColor: "#cc0000", width: "fit-content", minWidth: "35px", m: "auto", padding: "4px", ml: "4px"}}
          id="delete-button-hover"
        >
          <img 
            className="trash-can-icon" 
            src="/trash-can-white.png" 
            alt="delete-icon-trash-can" 
          />
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentPreview;
