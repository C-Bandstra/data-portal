import React from 'react';
import { Card, Typography, Avatar, Box } from '@mui/material';
import { getFileType } from '../utils';

const FileQuickViewCard = ({ fileName, fileSize }) => {
  const fileType = getFileType(fileName);

  return (
    <Card sx={{ display: 'flex', maxWidth: "30%",flexDirection: "column", alignItems: "flex-start", border: `1px solid ${fileType.color}`, color: '#fff', padding: '0.25em', borderRadius: '6px', mt: "0.25em" }}>
      {/* File type icon with color */}
      <Avatar sx={{ backgroundColor: '#fff', color: fileType.color, m: "0px auto"}}>
        {fileType.icon}
      </Avatar>
      {/* File details */}
      <Box sx={{ padding: 0, display: "flex", flexDirection: "column", width: "100%" }}>
        <Typography 
          variant="caption" 
          sx={{
            color: "rgba(0, 0, 0, 0.70)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: "600",
            textDecoration: "underline",
            m: "auto",
            width: "100%",

          }}>
          {fileName}
        </Typography>
      </Box>
    </Card>
  );
};

export default FileQuickViewCard;
