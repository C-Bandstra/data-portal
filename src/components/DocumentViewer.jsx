// import { useState, useEffect } from 'react'
// import { useLocation } from 'react-router-dom';
// import { viewZohoDocument, createZohoDocument, getTokenFromLocalStorage } from '../zoho';


// export const DocumentViewer = ({ documentUrl }) => {
//   // const [documentId, setDocumentId] = useState(null);
//   //   const location = useLocation();

//     const [accessToken, setAccessToken] = useState(null);

//     // const localStorageToken = getAccessTokenFromStorage();

//     useEffect(() => {
//       // Function to get query parameters from the URL
//       const getAccessTokenFromUrl = () => {
//         const currentUrl = window.location.href; // Get the full URL
//         const accessToken = currentUrl.split('/').pop(); // Extract the last part of the URL (access token)
//         return accessToken;
//       };
  
//       // Extract the access token from the URL
//       // const token = getAccessTokenFromUrl();
      
//       if (localStorageToken) {
//         // saveAccessTokenToStorage(token);
//         // Use the token as needed
//         const documentCreationStatus = createZohoDocument();

//         console.log('Access Token:', localStorageToken);
//       } else {
//         console.error('No access token found in the URL');
//       }
//     }, []);

//   return (
//     // <iframe
//     //     src={documentUrl}
//     //     style={{ width: '100%', height: '600px', border: 'none' }}
//     //     title="Document Viewer"
//     // ></iframe>
//     <h1>Document Viewer</h1>
// );
// }
