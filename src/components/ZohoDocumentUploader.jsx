import React, { useState, useEffect } from 'react';
import { 
  createZohoDocument,
  getTokensFromUrl, 
  saveTokenToLocalStorage, 
  getTokenFromLocalStorage 
} from '../zoho';

const ZohoDocumentUploader = () => {
  const [file, setFile] = useState(null);
  const [base64Content, setBase64Content] = useState(null);

  useEffect(() => {
    // Function to get query parameters from the URL
    const {accessToken, refreshToken, expiresIn} = getTokensFromUrl();

    if(accessToken) {
      saveTokenToLocalStorage(accessToken, refreshToken, expiresIn)
    }

    // Extract the access token from the URL
    // const token = getAccessTokenFromUrl();
    
    // if (localStorageToken) {
    //   // saveAccessTokenToStorage(token);
    //   // Use the token as needed
    //   const documentCreationStatus = createZohoDocument();

    //   console.log('Access Token:', localStorageToken);
    // } else {
    //   console.error('No access token found in the URL');
    // }
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    encodeFileToBase64(selectedFile);
  };

  const encodeFileToBase64 = (file) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // Get only the Base64 part, ignoring the metadata
      setBase64Content(base64String);
    };

    reader.onerror = (error) => {
      console.error('File could not be read:', error);
    };

    reader.readAsDataURL(file); // Read file as Base64 encoded string
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Check if the file and base64Content are provided
    if (!file || !base64Content) {
      alert('Please upload a file first.');
      return;
    }

    console.log('Is valid file:', file instanceof File);
  
    // Retrieve the access token from local storage
    const accessToken = getTokenFromLocalStorage()
  
    if (!accessToken) {
      alert('Access token is missing. Please log in again.');
      return;
    }

      const requests = {
        request_name: "CLJA Form",
        description: "Empty CLJA Form",
        is_sequential: true,
        actions: [
          {
            action_type: "SIGN",
            recipient_email: "cbandstra@wagstafflawfirm.com",
            recipient_name: "Charlie Bandstra",
            signing_order: 0,
            verify_recipient: true,
            verification_type: "EMAIL",
            private_notes: "To be signed"
          },
        ],
        expiration_days: 10,
        email_reminders: true,
        reminder_period: 2,
        notes: "Note for all recipients"
      }

      console.log('Actions IN FRONTEND:', JSON.stringify(requests.actions, null, 2));
    
    // Ensure to pass documentData directly without stringifying the actions array
    
    // Now you can use this updated documentData when constructing the FormData    
  
    try {
      console.log("FILE NAME FROM FILE OBJECT SELECTED", file.name)
      // Call the createZohoDocument function with the access token and document data
      // accessToken, documentData, fileObject
      const documentId = await createZohoDocument(accessToken, requests, {
        title: file.name,
        content: base64Content, // Send the Base64 encoded content
      });
      
      // Log success and handle the document ID as needed
      console.log('Document created successfully with ID:', documentId);
    } catch (error) {
      // Handle errors in creating the document
      console.error('Error creating document:', error);
      alert('Failed to create document. Please try again.');
    }
  };

  return (
    <div>
      <h1>Upload Document To Zoho</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
        <button type="submit" disabled={!file}>Create Document</button>
      </form>
    </div>
  );
};

export default ZohoDocumentUploader;
