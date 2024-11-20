import React, { useState, useRef } from 'react';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  IconButton, 
  Chip, 
  Typography, 
  Box,
  Stack,
  Alert,
  CircularProgress,
  MenuItem,
  Select, 
  InputLabel, 
  FormControl,
  FormHelperText,
  Divider
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { AddCircle } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFocusListener } from '../../hooks';
import { useSelector } from 'react-redux';
import { getFormattedDate } from '../../utils';
import { createDocumentAlert } from '../../api/adminApiCalls';
import { setAlertsHaveBeenUpdated } from '../../redux/slices/adminSlice';
import { encodeFileToBase64 } from '../../utils';
import { createEnvelope } from '../../docusign';
import { useDispatch } from 'react-redux';
import { fetchMatterInfo } from '../../api/claimantApiCalls';
import { tags } from '../../utils';
import FileQuickViewCard from '../../components/FileQuickViewCard';

const CreateAlertForm = ({ getAdminEmail }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [matters, setMatters] = useState([]); // Array of staged matters
  const [csvError, setCsvError] = useState(''); // For CSV validation error message
  const [hasFocused, setHasFocused] = useState(false);
  const [matterError, setMatterError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, reset, setValue, getValues, watch } = useForm({
    defaultValues: {
      campaign: '',
      matter: '',
      file: null,
      tag: '',
      message: '',
    }
  });

  // Use `watch` to observe changes to the "file" field
  const file = watch("file");

  const fileInputRef = useRef(null);

  const user = useSelector((state) => state.admin.user);
  
  useFocusListener(open, "alert-matter-input", setHasFocused)

  // Add matter to staging area
  const handleAddMatter = () => {
    const matter = getValues('matter');
    if(matters.includes(matter)) {
      setMatterError(`${matter} is already added.`)
    } else if(matter.length === 4) {
      setMatterError(`${matter} is not a valid Matter.`)
    }
    if (matter.length > 4 && !matters.includes(matter)) {
      setMatters([...matters, matter]);
    }
    setValue('matter', 'MAT-'); // Clear input after adding
  };

  // Remove matter from staging area
  const handleRemoveMatter = async (matterToRemove) => {
    const updatedMatters = matters.filter((matter) => matter !== matterToRemove)
    setMatters(updatedMatters);
    if(!updatedMatters.length) {
      setMatterError("");
    }
  };

  // Handle key press event for Enter key
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key press
      handleAddMatter(); // Add the matter to the staging area
    }
    setMatterError("")
  };

  const handleButtonClick = () => {
    // Allows for cancel uploading file and still upload it later
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };

  // Handle CSV file upload and parse matter numbers
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    setCsvError(''); // Clear previous errors

    // Validate the file is a CSV
    if (file && file.type !== 'text/csv') {
      setCsvError('Please upload a valid CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const csvMatters = content.split(',').map((matter) => matter.trim()); // Split CSV by commas and trim spaces

      // Filter out duplicates and append new matters
      const newMatters = csvMatters.filter((matter) => matter && !matters.includes(matter));

      const hadDuplicates = csvMatters > newMatters;
      hadDuplicates && setMatterError("Matter(s) already present have not been added.") 
      setMatters([...matters, ...newMatters]); // Update matters with new values
    };

    if (file) {
      reader.readAsText(file); // Read the uploaded file
    }
  };

  const generateDocumentId = () => Math.floor(Math.random() * 100000);

  const buildRecipientList = async () => {
    const recipients = await Promise.all(
      matters.map(async (matter, i) => {
        console.log(matter)
        const { litify_pm__Display_Name, litify_pm__Email } = await fetchMatterInfo(matter);
        return {
          email: litify_pm__Email,
          name: litify_pm__Display_Name,
          recipientId: (i + 1).toString(), // Ensure recipientId is a string (like '1')
          clientUserId: matter,
        };
      })
    );
    return recipients;
  };


  // MULTI RECIPIENT ENVELOPE CREATION
  // const handleDocusignEnvelopeCreation = async ({ file, tag, campaign }) => {
  //   if (file) {
  //     setLoading(true);
  //     try {
  //       const base64Data = await encodeFileToBase64(file);
  //       let recipientList = await buildRecipientList();
  //       const envelopeResponse = await createEnvelope(base64Data, tag, generateDocumentId(), recipientList, campaign);
  //       setSuccess(true);
  //       return envelopeResponse;
  //     } catch (error) {
  //       console.error('Error encoding file:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  // // Form submission handler
  // const onSubmit = async (submitData, e) => {  
  //   const timestamp = getFormattedDate();
  //   // const adminEmail = getAdminEmail(); // Call your pre-built function to get the current admin email

  //   const envelopeResponse = await handleDocusignEnvelopeCreation(submitData);
  //   console.log(envelopeResponse)
  //   const formData = {
  //     campaign: submitData.campaign,
  //     created_by: user,
  //     matters,
  //     alert_document_url: envelopeResponse.uri.substring(1),
  //     message: submitData.message,
  //     insert_date: timestamp,
  //     document_type: submitData.tag,
  //   };

  //   console.log(formData); // Handle the API call or data processing

  //   await createDocumentAlert(formData);

  //   dispatch(setAlertsHaveBeenUpdated(true));

  //   handleClose(); // Close and reset the form
  // };

  //SINGLE RECIPIENT ENVELOPE CREATION
  // Modify handleDocusignEnvelopeCreation to accept a single recipient
const handleDocusignEnvelopeCreation = async ({ file, tag, campaign, recipient }) => {
  if (file && recipient) {
    setLoading(true);
    try {
      const base64Data = await encodeFileToBase64(file);
      const envelopeResponse = await createEnvelope(
        base64Data,
        tag,
        generateDocumentId(),
        [recipient],  // Pass single recipient as an array
        campaign
      );
      setSuccess(true);
      return envelopeResponse;
    } catch (error) {
      console.error('Error encoding file:', error);
    } finally {
      setLoading(false);
    }
  }
};

// Refactor onSubmit to create one envelope per recipient and save each result
  const onSubmit = async (submitData, e) => {
    const timestamp = getFormattedDate();
    const recipientList = await buildRecipientList();

    // Use for...of loop to ensure async actions are awaited
    for (const recipient of recipientList) {
      const envelopeResponse = await handleDocusignEnvelopeCreation({
        file: submitData.file,
        tag: submitData.tag,
        campaign: submitData.campaign,
        recipient
      });

      if (envelopeResponse) {
        // Prepare formData with envelope details
        const formData = {
          campaign: submitData.campaign,
          created_by: user,
          matter_name: recipient.clientUserId,
          alert_document_url: envelopeResponse.uri.substring(1),
          message: submitData.message,
          insert_date: timestamp,
          document_type: submitData.tag,
        };

        // Save formData to the database
        await createDocumentAlert(formData);
      }
    }

    // Dispatch update and handle close actions once all recipients have been processed
    dispatch(setAlertsHaveBeenUpdated(true));
    handleClose(); // Close and reset the form
  };

  // Open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClearAll = () => {
    if (matters.length > 0) {
      if (window.confirm("Are you sure you want to clear all matters?")) {
        setMatters([]);
      }
    }
  };

  // Close and reset the dialog form
  const handleClose = () => {
    reset(); // Reset form fields when closing
    setMatters([]); // Clear staged matters
    setOpen(false);
    setMatterError("")
    // setValue("matter", "MAT-")
  };

  return (
    <>
      <Button sx={{marginLeft: "3em"}} variant="contained" color="primary" onClick={handleClickOpen}>
        Create Alert
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle variant='h5' sx={{ pb: "0px" }}>Create New Alert</DialogTitle>

        {/* Moved form start inside DialogContent */}
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Campaign Name */}
            <Controller
              name="campaign"
              control={control}
              defaultValue=""
              rules={{ required: 'Campaign is required' }} // Required validation
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  id="alert-campaign-input"
                  label="Campaign"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error ? error.message : null} // Display error message
                />
              )}
            />

            {/* Matter Input and Add Button */}
            <Controller
              name="matter"
              control={control}
              defaultValue=""
              rules={{ required: 'Matter is required' }} // Required validation
              render={({ field, fieldState: { error } }) => (
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    {...field}
                    id="alert-matter-input"
                    label="Matter"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setValue('matter', e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={hasFocused ? getValues('matter') : ""}
                    error={!!error}
                    helperText={error ? error.message : null} // Display error message
                  />
                  <IconButton color="primary" onClick={handleAddMatter}>
                    <AddCircle />
                  </IconButton>
                </Stack>
              )}
            />

            {/* CSV Upload Section with Error Handling */}
            <Button
              variant="outlined"
              component="label"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
            >
              Choose CSV File
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                hidden
                onChange={handleCsvUpload}
              />
            </Button>
            {csvError && (
              <Typography color="error" variant="body2">
                {csvError}
              </Typography>
            )}

            {matterError && (
              <Typography sx={{ color: "#d32f2f", mb: "16px" }}>{matterError}</Typography>
            )}

            {/* Staging Area for Matters */}
            {matters.length > 0 && (
              <Box
                sx={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  borderBottom: matters.length > 1 ? "1px solid #ccc" : "0px",
                  padding: '8px',
                  borderRadius: '4px',
                  my: 2,
                }}
              >
                {matters.map((matter, index) => (
                  <Chip
                    key={index}
                    label={matter}
                    onDelete={() => handleRemoveMatter(matter)}
                    deleteIcon={
                      <DeleteIcon
                        sx={{ "& .MuiChip-deleteIcon": { backgroundColor: "#000080" } }}
                      />
                    }
                    sx={{
                      mr: 1,
                      mb: 1,
                      border: "1px solid #000080",
                      color: "#000080",
                    }}
                  />
                ))}
              </Box>
            )}

            {matters.length > 1 && (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant='outlined' onClick={handleClearAll}>
                  Clear All Matters
                </Button>
              </Box>
            )}
            <Divider sx={{ my: "1em", borderBottomWidth: "2px" }} orientation="horizontal" />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",  // Vertical centering
                justifyContent: "center",  // Centering horizontally
                width: "100%",
                gap: "2em",  // Gap between the fields
              }}
            >
              {/* File Upload Button */}
              <Controller
                name="file"
                control={control}
                defaultValue={null}
                rules={{ 
                  validate: (value) => value ? true : "File is required"  // Custom validation for the file input
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    error={!!error}
                    sx={{ flex: 1 }}
                  >
                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '4em',
                        backgroundColor: '#000080',
                        color: 'white',
                        textAlign: 'center',
                      }}
                    >
                      Select PDF To Upload
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          handleButtonClick();
                          field.onChange(e.target.files[0]); // Update form state with the file
                        }}
                      />
                    </Button>
                    {/* Display error message if present */}
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {/* Tag Selection Dropdown */}
              <Controller
                name="tag"
                control={control}
                defaultValue=""
                rules={{ required: 'Tag is required' }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    variant="outlined"
                    sx={{ flex: 1 }}
                    error={!!error}  // Show error styling for this field
                  >
                    <InputLabel id="tag-label">Select a Tag</InputLabel>
                    <Select
                      labelId="tag-label"
                      label="Select a Tag"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    >
                      <MenuItem value="" disabled>Select a Tag</MenuItem>
                      {tags.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* Display error message if present */}
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {file && <FileQuickViewCard fileName={file?.name}/>}

            {/* Message Field */}
            <Controller
              name="message"
              control={control}
              defaultValue=""
              rules={{ required: 'Message is required' }} // Required validation
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Message"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />

            {/* Submit and Cancel Buttons */}
            <DialogActions>
              <Button onClick={handleClose} variant='outlined'>Cancel</Button>
              <Button type="submit" color="primary" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </form>
          {loading && <CircularProgress />}
          {success && <Alert severity="success">Document uploaded successfully!</Alert>}
        </DialogContent>
      </Dialog>
    </>

  );
};

export default CreateAlertForm;
