// import { updateTokenInDB } from "./api/adminApiCalls";
import axios from "axios"
const apiUrl = process.env.REACT_APP_API_URL;
// const envelope = 
// {"envelopeId": "c5d60a33-a395-45de-94c8-4536e2c6b157",
//     "uri": "/envelopes/c5d60a33-a395-45de-94c8-4536e2c6b157",
//     "statusDateTime": "2024-10-03T21:38:51.2170000Z",
//     "status": "created"}

export const storeTokensFromUrl = (location) => {
    // Replace all instances of &amp; with &
    const sanitizedSearch = location.search.replace(/&amp;/g, '&');
    const urlParams = new URLSearchParams(sanitizedSearch);

    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const expiresIn = urlParams.get('expires_in');
    const email = urlParams.get('email');
    const matter = urlParams.get('matter');

    if (accessToken && refreshToken) {
        // Store tokens in localStorage
        localStorage.setItem('docusign_access_token', accessToken);
        localStorage.setItem('docusign_refresh_token', refreshToken);
        localStorage.setItem('docusign_refresh_expires_in', expiresIn);
        localStorage.setItem('docusign_token_received_time', Date.now()); // Optional: track when tokens were received

        // const updateTokenResponse = await updateTokenInDB(refreshToken, expiresIn);

        // console.log("Token updated in Token Database",updateTokenResponse)

        console.log('Tokens stored in localStorage');

        // Return the email for use in your component
        return { accessToken, refreshToken, email, matter };
    } else {
        console.error('Access token or refresh token missing from URL');
    }
};

// export const storeTokensFromUrl = (location) => {
//     // Replace all instances of &amp; with &
//     const sanitizedSearch = location.search.replace(/&amp;/g, '&');
//     const urlParams = new URLSearchParams(sanitizedSearch);

//     const accessToken = urlParams.get('access_token');
//     const refreshToken = urlParams.get('refresh_token');
//     const stateParam = urlParams.get('state');  // Get the state parameter which contains both email and matter

//     if (accessToken && refreshToken && stateParam) {
//         // Decode the state parameter and parse the JSON
//         let stateData;
//         try {
//             stateData = JSON.parse(decodeURIComponent(stateParam));
//         } catch (error) {
//             console.error('Failed to decode or parse state parameter', error);
//             return;
//         }

//         const { email, matter } = stateData;  // Extract email and matter from the state data

//         // Store tokens and additional state in localStorage
//         localStorage.setItem('docusign_access_token', accessToken);
//         localStorage.setItem('docusign_refresh_token', refreshToken);
//         localStorage.setItem('docusign_token_received_time', Date.now()); // Optional: track when tokens were received

//         console.log('Tokens and state stored in localStorage');

//         // Return accessToken, refreshToken, email, and matter for further use
//         return { accessToken, refreshToken, email, matter };
//     } else {
//         console.error('Access token, refresh token, or state parameter missing from URL');
//     }
// };

export const getValidAccessToken = async () => {
    let accessToken = localStorage.getItem('docusign_access_token');
  
    if (isAccessTokenExpired()) {
        accessToken = await refreshAccessToken();
    }
  
    return accessToken;
};

// Helper function to check if access token is expired
export const isAccessTokenExpired = () => {
    const tokenReceivedTime = localStorage.getItem('docusign_token_received_time');
    if (!tokenReceivedTime) return true; // No token received time means token is expired
    
    const currentTime = Date.now();
    const tokenLifetime = 3600000; // 1 hour in milliseconds (adjust based on actual expiration time)
  
    return (currentTime - tokenReceivedTime) > tokenLifetime;
};

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('docusign_refresh_token');
    
    if (!refreshToken) {
        console.error('No refresh token available');
        throw new Error('No refresh token available');
    }
  
    try {
        const response = await axios.post(`${apiUrl}/docusign/auth/refresh`, {
            refresh_token: refreshToken,
        });
    
        const { access_token, refresh_token } = response.data;
    
        // Save the new access token and the time it was received
        localStorage.setItem('docusign_access_token', access_token);
        localStorage.setItem('docusign_refresh_token', refresh_token);
        localStorage.setItem('docusign_token_received_time', Date.now());
    
        console.log('Access token refreshed');
        return access_token;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        throw error;
    }
};

export const fetchUserInfo = async () => {
    try {
        const accessToken = await getValidAccessToken();
    
        const response = await axios.get(`${apiUrl}/docusign/userinfo`, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
        
        console.log('User Info Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error.response?.data || error.message);
    }
};  

export const createDocument = async (documentData, name, documentId) => {
    try {
        const accessToken = await getValidAccessToken();
  
        // Make the DocuSign API call with the (possibly refreshed) access token
        const response = await axios.post(`${apiUrl}/docusign/createDocument`, {
            documentData,  // Base64 encoded document data
            name,          // Document name
            documentId,    // Document ID
        }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    });
      console.log('Document created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating document:', error);
    }
};

export const createEnvelope = async (documentData, name, documentId, recipients, campaign) => {
    try {
        // Get a valid access token (refresh if necessary)
        const accessToken = await getValidAccessToken();
    
        // Make the API call to create an envelope
        const response = await axios.post(`${apiUrl}/docusign/create-envelope`, {
            documentData,  // Base64 encoded document data
            name,          // Document name
            documentId,    // Document ID
            recipients,    // List of recipients [{ email, name, recipientId }]
            campaign,      // Campaign data
        }, {
            headers: {
            Authorization: `Bearer ${accessToken}`,  // Use the valid access token
            },
        });
    
        console.log('Envelope created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating envelope:', error.response?.data || error.message);
    }
};  

export const getDocusignEnvelopeDetails = async (envelopeId) => {
    try {
        const response = await axios.post(`${apiUrl}/get-envelope-details`, {envelopeId});
        console.log('Envelope details:', response.data);
        return response.data; // This contains the envelope details, including document info
    } catch (error) {
        console.error('Error fetching envelope details:', error.response ? error.response.data : error.message);
    }
};

export const getDocusignRecipientDetails = async (recipientsUri) => {
    try {
        // Get a valid access token (refresh if necessary)
        // const accessToken = await getValidAccessToken();
        
        const response = await axios.post(`${apiUrl}/get-recipient-details`, {recipientsUri})
            // headers: {
            //     Authorization: `Bearer ${accessToken}`,
            // },
        // });

        console.log('Envelope details:', response.data);
        return response.data; // This contains the envelope details, including document info
    } catch (error) {
        console.error('Error fetching envelope details:', error.response ? error.response.data : error.message);
    }
};

export const createDocusignConsoleView = async (envelopeId) => {
    try {
        // Get a valid access token (refresh if necessary)
        // const accessToken = await getValidAccessToken();
    
        // Package parameters into the request body
        const requestBody = {
            envelopeId
        };
    
        // Make the API call to create the console view
        const response = await axios.post(`${apiUrl}/create-console-view`, requestBody, {
            headers: {
            // Authorization: `Bearer ${accessToken}`, // Use the valid access token
            'Content-Type': 'application/json',
            },
        });
    
        console.log('Console view URL:', response.data.url);
        return response.data.url; // Return the console view URL to use or redirect
    } catch (error) {
        console.error('Error creating console view:', error.response?.data || error.message);
    }
};
  

export const createDocusignRecipientView = async (envelopeId, recipientIdGuid, userName, email, clientUserId, recipientId) => {
    //ACCESS TOKEN IS HANDLED BY BACKEND
    try {
        // Package parameters into the request body
        const requestBody = {
            envelopeId: envelopeId,
            recipientIdGuid: recipientIdGuid,
            recipientName: userName,
            recipientEmail: email,
            clientUserId: clientUserId,
            recipientId: recipientId,
        };
    
        console.log("Body To Send: ", requestBody);
    
        // Make the API call to create the recipient view
        const response = await axios.post(`${apiUrl}/create-recipient-view`, requestBody, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
        console.log('Recipient view URL:', response.data.url);
        return response.data.url; // Return the recipient view URL to use or redirect
    } catch (error) {
        console.error('Error creating recipient view:', error.response?.data || error.message);
    }
};

export const createDocusignEnvelopeView = async (envelopeId, recipientIdGuid, userName, email, clientUserId, recipientId) => {
    //ACCESS TOKEN IS HANDLED BY BACKEND
    try {
        // Package parameters into the request body
        const requestBody = {
            envelopeId: envelopeId,
            recipientIdGuid: recipientIdGuid,
            recipientName: userName,
            recipientEmail: email,
            clientUserId: clientUserId,
            recipientId: recipientId,
        };
    
        console.log("Body To Send: ", requestBody);
    
        // Make the API call to create the recipient view
        const response = await axios.post(`${apiUrl}/create-recipient-view`, requestBody, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
        console.log('Recipient view URL:', response.data.url);
        return response.data.url; // Return the recipient view URL to use or redirect
    } catch (error) {
        console.error('Error creating recipient view:', error.response?.data || error.message);
    }
};
  
