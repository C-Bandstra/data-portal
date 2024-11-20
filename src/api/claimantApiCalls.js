const apiUrl = process.env.REACT_APP_API_URL;

export const fetchMatterInfo = async (matterNumber) => {
    // const cleanedNumber = matterNumber.replace("MAT-", "");
    try {
        const response = await fetch(`${apiUrl}/api/data`, {
            method: 'POST', // Ensure method is a string
            headers: {
                'Content-Type': 'application/json', // Ensure headers is an object
        },
            body: JSON.stringify({ matterNumber }), // Ensure body is a string (use JSON.stringify)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        const data = await response.json();
        return data[0];
        // Handle the data as needed in your React app
    } catch (error) {
      console.error('Fetch error:', error);
    }
};

export const fetchMatterCompletedStatus = async (matterNumber, envelopeId) => {
    console.log({envelopeId: envelopeId, matterNumber: matterNumber})
    // const cleanedNumber = matterNumber.replace("MAT-", "");
    try {
        const response = await fetch(`${apiUrl}/get-matter-completed-status`, {
            method: 'POST', // Ensure method is a string
            headers: {
                'Content-Type': 'application/json', // Ensure headers is an object
        },
            body: JSON.stringify({ matterNumber, envelopeId }), // Ensure body is a string (use JSON.stringify)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        const data = await response.json();
        return data[0];
        // Handle the data as needed in your React app
    } catch (error) {
      console.error('Fetch error:', error);
    }
};

export const fetchMatterNameWithClaimantCreds = async (email, dob, lastName, timeout = 5000) => {
    try {
        const fetchPromise = fetch(`${apiUrl}/get-matter-name`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, dob, lastName }), // Sending credentials
        });

        const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Please enter the Matter Number and the PIN provided in your SMS message in the form above, then click 'Login'.`)), timeout)
        );

        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
        }

        const data = await response.json();
        return data.name; // Return only the 'name' of the matter
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error so it can be handled by the calling code
    }
};

export const createClaimantUpload = async (data) => {
    // Extract relevant data from 'data' parameter, setting default values
    const { 
        formattedDate, 
        documentId, 
        matterNumber, 
        campaign, 
        file_name = null, 
        note = null, 
        url = null, 
        tags = null, 
        dropdown = null 
    } = data;

    // Construct request body
    let requestBody = {
        "document_Id": documentId,
        "file_name": file_name,
        note: note,
        matter: matterNumber,
        url: url,
        tags: tags,
        "created_date": formattedDate,
        dropdown: dropdown,
        campaign: campaign,
    };

    console.log(requestBody);

    try {
        const response = await fetch(`${apiUrl}/api/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            console.log('Data inserted successfully');
        } else {
            console.error('Failed to insert data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export const updateClaimantUpload = async (data) => {
    // Extract relevant data from 'data' parameter, setting default values
    const { 
        document_Id = null, 
        note = null, 
        dropdown = null 
    } = data;

    // Construct request body
    let requestBody = {
        "document_Id": document_Id,
        "note": note,
        "dropdown": dropdown
    };

    console.log(requestBody);

    try {
        const response = await fetch(`${apiUrl}/api/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            console.log('Data updated successfully');
        } else {
            console.error('Failed to update data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export const checkClaimantUploadByDocumentId = async (documentId) => {
    try {
        const response = await fetch(`${apiUrl}/check-claimant-upload?documentId=${documentId}`, {
            method: 'GET',
        });

        if (response.ok) {
            return response.json(); // Expecting JSON response
        } else {
            console.error('Failed to retrieve claimant upload by document ID');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export const updateClaimantUrlByDocumentId = async (documentId, consoleViewUrl) => {
    let requestBody = {
        documentId: documentId,
        newUrl: consoleViewUrl
    };

    console.log(requestBody);

    try {
        const response = await fetch(`${apiUrl}/update-claimant-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), // Send object of form data
        });

        if (response.ok) {
            console.log('Console View URL inserted successfully');
        } else {
            console.error('Failed to insert Console View URL');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export const fetchClaimantUploadByDocumentId = async (documentId) => {
    try {
        const response = await fetch(`${apiUrl}/claimantUploads/documentId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documentId }), 
        });
    
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const fetchMatterUploadHistory = async (matterNumber) => {
    try {
        const response = await fetch(`/api/retrieve/${matterNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
  
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
  
        const uploadHistory = await response.json();
        return uploadHistory;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export const createClaimantContactInfo = async (formData) => {
    // Restructure formData into the expected format for the API
    try {
        const response = await fetch(`${apiUrl}/api/insert-claimant-contact-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData) // Send the contact info as JSON
        });
  
        if (response.ok) {
            console.log('Claimant contact info inserted successfully');
        } else {
            console.error('Failed to insert claimant contact info');
        }
    } catch (error) {
        console.error('Error:', error);
    }
  };
  
export const fetchClaimantContactInfo = async (matterNumber) => {
    try {
      const response = await fetch(`${apiUrl}/api/claimant-contact-info?matter=${matterNumber}`); // Use 'matter' as the param
  
      if (!response.ok) {
        throw new Error('Failed to fetch claimant info');
      }
  
      const data = await response.json();
      return data; // Return the fetched data
  
    } catch (error) {
      console.error('Error fetching claimant info:', error);
    //   throw error; // Rethrow the error to be handled by the caller
    }
};

export const toggleClaimantReadStatus = async (matterName, campaign) => {
    try {
        const response = await fetch(`${apiUrl}/toggleClaimantReadStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matter_name: matterName, campaign }), // Pass both matter_name and campaign
        });

        if (!response.ok) {
            throw new Error('Failed to update claimant read status');
        }

        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error:', error);
    }
};

export const fetchDocumentAlertsByMatter = async (matterName) => {
    try {
        const response = await fetch(`${apiUrl}/documentAlerts/matter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matter_name: matterName }), // Pass both matter_name and campaign
        });

        if (!response.ok) {
            throw new Error('Failed to update claimant read status');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

// export const fetchClaimantUploadsByCampaign = async (campaign) => {
//     try {
//         const response = await fetch(`${apiUrl}/api/getClaimantUploadsByCampaign?campaign=${encodeURIComponent(campaign)}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             throw new Error('Failed to fetch claimant uploads by campaign');
//         }

//         const data = await response.json();
//         console.log('Claimant Uploads:', data);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };


