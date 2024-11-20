import axios from "axios"

export const saveTokenToLocalStorage = (accessToken, refreshToken, expiresIn) => {
  const expiryTime = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds
  localStorage.setItem('zohoToken', JSON.stringify({
    accessToken,
    refreshToken,
    expiryTime,
  }));
};

export const getTokenFromLocalStorage = () => {
  const tokenData = localStorage.getItem('zohoToken');
  if (!tokenData) {
    return null;
  }

  try {
    const { accessToken, refreshToken, expiryTime } = JSON.parse(tokenData);
    if (Date.now() < expiryTime) {
      // Token is still valid
      return { accessToken, refreshToken, expiryTime };
    } else {
      // Token is expired
      return null;
    }
  } catch (error) {
    console.error('Error parsing token data from local storage:', error);
    return null;
  }
};

export const handleZohoLogin = () => {
  console.log("Handling zoho login flow")
  const clientId = process.env.REACT_APP_ZOHO_CLIENT_ID;
  const redirectUri = "http://localhost:3001/zoho/auth/callback"; // Backend route for handling callback
  const zohoAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=ZohoSign.documents.ALL&access_type=offline&prompt=consent`;

  window.location.href = zohoAuthUrl; // Redirect user to Zoho for authorization
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
      params: {
        refresh_token: refreshToken,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;
    saveTokenToLocalStorage(access_token, refresh_token, expires_in); // Save new token

    return access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error.response?.data || error.message);
    throw new Error('Failed to refresh access token');
  }
};

export const ensureValidToken = async () => {
  const tokenData = getTokenFromLocalStorage();
  if (tokenData) {
    return tokenData.accessToken; // Token is valid
  } else {
    // Token is not available or expired, need to refresh
    const refreshToken = tokenData ? tokenData.refreshToken : null;
    if (refreshToken) {
      return await refreshAccessToken(refreshToken);
    } else {
      throw new Error('No valid refresh token available');
    }
  }
};

export const viewZohoDocument = async (accessToken, documentId) => {
  try {
      const response = await axios.get(
          `https://sign.zoho.com/api/v1/documents/${documentId}`, 
          {
              headers: {
                  Authorization: `Zoho-oauthtoken ${accessToken}`
              }
          }
      );
      console.log(response.data);
      // Handle the response, which might include document metadata
  } catch (error) {
      console.error('Error fetching Zoho document details:', error);
  }
};

// PRE ZOHO MEETING 
// export const createZohoDocument = async (accessToken, documentData) => {
//   console.log("ZOHO TEST ACCESS TOKEN", accessToken);
//   try {
//     // Make POST request to backend API to create the document
//     const response = await axios.post(
//       'http://localhost:3001/api/createZohoDocument',
//       documentData,
//       {
//         headers: {
//           Authorization: `Zoho-oauthtoken ${accessToken.accessToken}`, // Include the access token in the Authorization header
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // Extract and return the document ID from the response
//     const documentId = response.data.documentId;
//     console.log('Created Document ID:', documentId);
//     return documentId;
//   } catch (error) {
//     // Log any errors that occur during the request
//     console.error('Error creating document:', error.response?.data || error.message);
//     throw error;
//   }
// };

//NEWEST VERSION OF CREATEZOHODOCUMENT
export const createZohoDocument = async (accessToken, requests, { title, content }) => {
  const formData = new FormData();

  // Convert Base64 content to Blob
  const byteCharacters = atob(content); // Decode Base64
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' }); // Adjust MIME type as necessary

  // Append the Blob as a file
  formData.append('file', blob, title); // Title will be the filename

  // Append 'requests' as a string (must be stringified for FormData)
  formData.append('requests', JSON.stringify(requests));

  try {
    const response = await axios.post('http://localhost:3001/api/createZohoDocument', formData, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken.accessToken}`,
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });

    return response.data.documentId; // Adjust based on API response
  } catch (error) {
    console.error('Error creating document:', error.response?.data || error.message);
    throw error;
  }
};


// export const createZohoDocument = async (accessToken, documentData, fileObject) => {
//   console.log("ZOHO TEST ACCESS TOKEN", accessToken);
  
//     // Create a new FormData object
//     const formData = new FormData();

//     // Append all necessary fields from documentData
//     for (const [key, value] of Object.entries(documentData)) {
//       formData.append(key, value);
//     }

//     // Append the actual file to FormData
//     formData.append('file', fileObject); // Ensure fileObject is the selected file

//   try {
//     // Make POST request to backend API to create the document
//     const response = await axios.post(
//       'http://localhost:3001/api/createZohoDocument',
//       formData,
//       {
//         headers: {
//           Authorization: `Zoho-oauthtoken ${accessToken.accessToken}`, // Include the access token
//           // No Content-Type header needed, Axios will automatically set it
//         },
//       }
//     );

//     // Extract and return the document ID from the response
//     const documentId = response.data.documentId;
//     console.log('Created Document ID:', documentId);
//     return documentId;
//   } catch (error) {
//     // Log any errors that occur during the request
//     console.error('Error creating document:', error.response?.data || error.message);
//     throw error;
//   }
// };



export const getTokensFromUrl = () => {
  // Use URLSearchParams to directly get query parameters
  const urlParams = new URLSearchParams(window.location.search); 

  const accessToken = urlParams.get('access_token'); // Get access token
  const refreshToken = urlParams.get('refresh_token'); // Get refresh token
  const expiresIn = urlParams.get('expires_in'); // Optional: Get expires in if needed

  // Check if tokens exist
  if (!accessToken || !refreshToken) {
    console.error('Tokens not found in URL');
    return null; // Return null or handle the error appropriately
  }

  return {
    accessToken,
    refreshToken,
    expiresIn, // Optional: include if you need this value
  };
};


// export const createZohoDocument = async (accessToken) => {
//   try {
//       const response = await axios.post(
//           'https://sign.zoho.com/api/v1/documents', 
//           {
//               // Include document creation details here
//               "title": "Sample Document",
//               "content": "Base64EncodedContentHere"
//           },
//           {
//               headers: {
//                   Authorization: `Zoho-oauthtoken ${accessToken}`,
//                   'Content-Type': 'application/json'
//               }
//           }
//       );
      
//       // Extract documentId from the response
//       const documentId = response.data.documentId; // Adjust based on the actual response structure
//       console.log('Created Document ID:', documentId);
      
//       return documentId;
//   } catch (error) {
//       console.error('Error creating document:', error);
//   }
// };