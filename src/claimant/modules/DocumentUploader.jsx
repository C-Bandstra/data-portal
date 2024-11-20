import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import NoteBox from './NoteBox';
import { Button, Typography, Box } from '@mui/material';
import { updateClaimantUpload } from '../../api/claimantApiCalls';
import { buttonStyles } from '../../utils';
import { useSelector } from 'react-redux';
import { claimantDropdownTags } from '../../utils';


const DocumentUploader = ({ alertDocumentUrl }) => {
  const envelopeId = alertDocumentUrl.replace('envelopes/', '');

  const [showNoteBox, setShowNoteBox] = useState(false);

  const envelopeDetails = useSelector((state) => state.envelopes[envelopeId]);

  //Component State
  const [formSubmitResponse, setFormSubmitResponse] = useState(""); //an additional submit message other than "response"
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      note: "",
      tags: [],
      date: "",
      issue: "",
    }
  });

  const onSubmit = async (data) => {
    try {
      // const formattedDate = getFormattedDate();

      //Claimant Creation takes place on View Document
      if(envelopeDetails?.envelopeId) {
        await updateClaimantUpload({
          document_Id: envelopeDetails?.envelopeId,
          note: data.note,
          dropdown: data.issue
        });
      } else {
        console.log("NO ENVELOPE ID FOR UPDATE")
      }
      reset()
      setFormSubmitResponse("Form submitted. Submit another or Logout.")
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleAddIssueTag = (issueTag) => {
    const showNoteBox = issueTag === "Other";
    showNoteBox ? setShowNoteBox(true) : setShowNoteBox(false);
    setValue("issue", issueTag)
  }

  const optionElements = claimantDropdownTags.map((tag, i) => (
    <option value={tag} key={i}>{tag}</option>
  ));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="caption" sx={{textDecoration: "underline"}}>Have an Issue?</Typography>
      <Controller
          name="issue"
          control={control}
          render={({ field }) => (
            <Box>
              <select 
                  className="tag-selection" 
                  name="options" 
                  onChange={(e) => handleAddIssueTag(e.target.value)}
                >
                  {optionElements}
                </select>
            </Box>
          )}
        />

        {
        showNoteBox &&
          <Controller
            name="note"
            control={control}
            rules={{ maxLength: 1000 }}
            render={({ field }) => (
              // <p>Tard</p>
              <NoteBox value={field.value} onChange={field.onChange}/>
            )}
          />

        }
      <Box sx={{ display: "flex", alignItems: "center"}}>
        <Button type="submit" id="form-submit" sx={[buttonStyles, { mt: '10px'}]} variant="contained">Submit</Button>
      </Box>
      <Typography sx={{ m: formSubmitResponse ? "10px" : "0px"}} color="#2A4C81" variant='h6'>{formSubmitResponse}</Typography>
    </form>
  );
};

export default DocumentUploader;