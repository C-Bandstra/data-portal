import { convertISODateToReadable, convertBooleanNumberToString } from "../utils";
const apiUrl = process.env.REACT_APP_API_URL;

export const fetchClaimantUploads = async (setRows) => {
    try {
        console.log("API URL:",apiUrl)
        const response = await fetch(`${apiUrl}/api/retrieve`);
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        const result = await response.json();
        
        // Transform the data to match the DataGrid row format
        const formattedRows = result.map((item, i) => ({
            id: i, // Use a unique ID
            request_Id: item.request_Id,
            document_Id: item.document_Id,
            fileName: item.file_name,
            note: item.note,
            matter: item.matter,
            url: item.url,
            tags: item.tags,
            createdDate: convertISODateToReadable(item.created_date),
        }));
  
        setRows(formattedRows.reverse());
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const createDocumentAlert = async (formData) => {
    try {
        const response = await fetch(`${apiUrl}/admin/createDocumentAlert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),  // Send formData directly as body
        });

        if (!response.ok) {
            console.error('Failed to create document alert:', response.statusText);
        } else {
            const data = await response.json();
            console.log('Document alerts created successfully:', data);
            return data;
        }
    } catch (error) {
        console.error('Error creating document alerts:', error);
    }
};

export const toggleAdminReadStatus = async (campaign) => {
    try {
        const response = await fetch(`${apiUrl}/admin/toggleAdminReadStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ campaign }),
        });

        if (!response.ok) {
            throw new Error('Failed to update admin read status');
        }

        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error:', error);
    }
};

export const fetchDocumentAlerts = async () => {
    try {
        const response = await fetch(`${apiUrl}/api/getDocumentAlerts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch complete document alerts');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

export const fetchCampaigns = async () => {
    try {
        const response = await fetch(`${apiUrl}/admin/getCampaigns`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch complete document alerts');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

export const fetchClaimantUploadsByCampaign = async (campaign, setRows) => {
    try {
        const response = await fetch(`${apiUrl}/claimantUploads/campaign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ campaign }), // Send campaign in body
        });
    
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        // Transform the data to match the DataGrid row format
        const formattedRows = result.map((item, i) => ({
            id: i, // Use a unique ID
            request_Id: item.request_Id,
            document_Id: item.document_Id,
            fileName: item.file_name,
            note: item.note,
            matter: item.matter,
            url: {envelopeId: item.document_Id, matter: item.matter}, //Using document_Id to generate a console view on button click
            tags: item.tags,
            campaign: item.campaign,
            createdDate: convertISODateToReadable(item.created_date),
            completed: convertBooleanNumberToString(item.recipient_signed_completed),
            finishLater: convertBooleanNumberToString(item.recipient_finish_later),
            authFailure: convertBooleanNumberToString(item.recipient_authentication_failure),
            declined: convertBooleanNumberToString(item.recipient_declined),
            delivered: convertBooleanNumberToString(item.recipient_delivered),
        }));
  
        setRows(formattedRows.reverse());
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const fetchDocumentAlertsByCampaign = async (campaign, setRows) => {
    try {
        const response = await fetch(`${apiUrl}/documentAlerts/campaign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ campaign }), // Send campaign in body
        });
    
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        // Transform the data to match the DataGrid row format
        const formattedRows = result.map((item, i) => ({
            id: i, // Use a unique ID
            matter_name: item.matter_name,
            message: item.message,
            alert_document_url: item.alert_document_url,
            insert_date: convertISODateToReadable(item.insert_date),
            campaign: item.campaign,
            admin_read: item.admin_read,
            claimant_read: item.claimant_read,
            created_by: item.created_by,
        }));
  
        setRows(formattedRows.reverse());
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const fetchCombinedByCampaign = async (campaign, setRows) => {
    try {
        const response = await fetch(`${apiUrl}/combined/campaign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ campaign }), // Send campaign in body
        });
    
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        // Transform the data to match the DataGrid row format
        const formattedRows = result.map((item, i) => ({
            id: i + 1, // Use a unique ID
            matter_name: item.matter_name,
            message: item.message,
            alert_document_url: item.alert_document_url,
            insert_date: convertISODateToReadable(item.insert_date),
            campaign: item.campaign,
            admin_read: item.admin_read,
            claimant_read: item.claimant_read,
            created_by: item.created_by,
            request_Id: item.request_Id,
            document_Id: item.document_Id,
            fileName: item.file_name,
            note: item.note,
            matter: item.matter,
            url: {envelopeId: item.document_Id, matter: item.matter}, //Using document_Id to generate a console view on button click
            tags: item.tags,
            createdDate: convertISODateToReadable(item.created_date),
            completed: convertBooleanNumberToString(item.recipient_signed_completed),
            finishLater: convertBooleanNumberToString(item.recipient_finish_later),
            authFailure: convertBooleanNumberToString(item.recipient_authentication_failure),
            declined: convertBooleanNumberToString(item.recipient_declined),
            delivered: convertBooleanNumberToString(item.recipient_delivered),
        }));
  
        setRows(formattedRows.reverse());
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const updateTokenInDB = async (refreshToken, expiresIn) => {
    try {
        const response = await fetch(`${apiUrl}/auth/update-refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refreshToken, expiresIn}),  // Send formData directly as body
        });

        if (!response.ok) {
            console.error('Failed to create document alert:', response.statusText);
        } else {
            const data = await response.json();
            console.log('Document alerts created successfully:', data);
            return data;
        }
    } catch (error) {
        console.error('Error creating document alerts:', error);
    }
};


