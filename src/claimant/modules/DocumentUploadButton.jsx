import React, { useEffect, useRef, useState } from 'react';
import { Button, Box } from '@mui/material';
import DocumentPreview from './DocumentPreview';
import '../../App.css';
import {Typography} from '@mui/material';
import { bytesToSize } from '../../utils';

const DocumentUploadButton = ({value, onChange, setTags, response, setShowNoteBox}) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [filePreviews, setFilePreviews] = useState(value || []);
  
  const handleButtonClick = () => {
    // Programmatically trigger a click on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
    fileInputRef.current.click();
    setError("");
  };


  const handleFileChange = (e) => {
  const files = Array.from(e.target.files);

  // Update local state with new files and their initial tag state
  const newPreviews = files.map((file) => ({
    file,
    convertedSize: bytesToSize(file.size), // File size converted to readable
    tags: file.tags ? [...file.tags] : [], // Initialize with an empty array for tags
  }));
  const updatedPreviews = [...filePreviews, ...newPreviews];
  // Update state
  setFilePreviews(updatedPreviews);

  onChange(updatedPreviews);
  // Pass the files to the parent form through onChange
  
};

const handleRemoveFile = (indexToRemove) => {
  // Remove file preview
  const updatedPreviews = filePreviews.filter((_, index) => index !== indexToRemove);
  setFilePreviews(updatedPreviews);

  // Update the files array in the parent form
  const updatedFiles = value.filter((_, index) => index !== indexToRemove);
  onChange(updatedFiles);
};

const handleAddTag = (index, newTag) => {
  // Update the tags for a specific file
  const updatedPreviews = filePreviews.map((preview, i) => {
    return i === index ? { ...preview, tags: [...preview.tags, newTag] } : preview
  }    
  );
  setFilePreviews(updatedPreviews);
  onChange(updatedPreviews);
};

useEffect(() => {
  const allTags = filePreviews.flatMap(preview => preview.tags);
  setTags(allTags)
  //set state in form and log on use effect in form
  console.log(filePreviews);
}, [filePreviews, setTags])

useEffect(() => {
  setFilePreviews([]);
}, [response])

  return (
    <>
      {/* The button that triggers the file selection */}
      <Button onClick={(e) => {
        if(filePreviews.length < 3) {
          handleButtonClick(e)
        } else {
          setError("max files reached")
        }
      }} variant="outlined" sx={{
        fontSize: '1em',
        m: '10px 0px',
      }}>Upload Document</Button>
      <Typography sx={{color: "#FF0000"}}>{error}</Typography>
      {/* Hidden file input element */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(event) => handleFileChange(event)}
        />
        <Box sx={{display: "flex"}}>
          { 
            filePreviews ?
              filePreviews.map((preview, i) => {
                return <DocumentPreview
                  name={preview.file.name} 
                  size={preview.convertedSize}
                  tagApplied={preview.tags}
                  handleAddTag={handleAddTag} 
                  handleRemoveFile={handleRemoveFile}
                  indexInPreviews={i}
                />
              }) :
              ""
          }
        </Box>
    </>
  );
}

export default DocumentUploadButton;